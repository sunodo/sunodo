import { Command, Flags } from "@oclif/core";
import path from "path";
import fs from "fs-extra";
import tar from "tar-fs";
import zlib from "zlib";
import { create } from "kubo-rpc-client";
import open from "open";
import Gauge from "gauge";
import { setGracefulCleanup, tmpNameSync } from "tmp";
import { createReadStream, write } from "fs";

export default class Deploy extends Command {
    static summary = "Deploy application to a live network.";

    static description =
        "Package, upload and deploy the application to a testnet or mainnet supported network.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = {
        ipfs: Flags.url({
            description:
                "address of IPFS node to upload the cartesi machine snapshot",
            default: new URL("http://127.0.0.1:5001"),
        }),
    };

    private async keypress() {
        process.stdin.setRawMode(true);
        return new Promise((resolve) =>
            process.stdin.once("data", (d) => {
                process.stdin.setRawMode(false);
                resolve(d);
            })
        );
    }

    private async pack(
        directory: string,
        destination: string,
        progress: (current: number, total: number) => void = () => {}
    ): Promise<fs.Stats> {
        return new Promise((resolve, reject) => {
            let bytesWritten = 0;
            const writeStream = fs.createWriteStream(destination);

            // list files to add to tar (non-recursive)
            const files = fs
                .readdirSync(directory, { withFileTypes: true })
                .filter((dirent) => dirent.isFile())
                .map((f) => f.name);

            // get sum of size of all files in bytes
            const entries = files.map((f) =>
                fs.statSync(path.join(directory, f))
            );
            const totalSize = entries
                .map((stat) => stat.size)
                .reduce((a, b) => a + b, 0);

            const mtime = new Date(0);
            const tarStream = tar.pack(directory, {
                entries: files,
                map: (headers) => ({ ...headers, mtime }),
            });

            const gzipStream = zlib.createGzip();
            writeStream.on("error", (error) => {
                reject(error);
            });
            writeStream.on("finish", () => {
                resolve(fs.statSync(destination));
            });
            tarStream.on("data", (chunk) => {
                bytesWritten += chunk.length;
                progress(bytesWritten, totalSize);
            });

            tarStream.pipe(gzipStream).pipe(writeStream);
        });
    }

    public async run(): Promise<void> {
        const { flags } = await this.parse(Deploy);

        const snapshot = path.join(".sunodo", "image");
        if (!fs.existsSync(snapshot) || !fs.statSync(snapshot).isDirectory()) {
            throw new Error(
                "Cartesi machine snapshot not found, run 'sunodo build'"
            );
        }

        // create tar from cartesi machine snapshot
        setGracefulCleanup();
        const tmpFile = tmpNameSync();
        const progress = new Gauge({ cleanupOnExit: false });
        const targz = await this.pack(snapshot, tmpFile, (current, total) => {
            progress.show("packing cartesi machine snapshot", current / total);
        });
        this.debug(`created .tar.gz at ${tmpFile} with ${targz.size} bytes`);

        // upload tar to IPFS, getting the CID
        const client = create({ url: flags.ipfs });
        const result = await client.add(createReadStream(tmpFile), {
            progress: (bytes) =>
                progress.show(
                    "uploading cartesi machine snapshot",
                    bytes / targz.size
                ),
        });
        progress.hide();
        const { cid } = result;
        this.log(`machine snapshot uploaded: ${cid.toString()}`);

        // open daploy webapp with CID pre-filled
        // const baseUrl = "https://app.sunodo.io/deploy";
        const baseUrl = "http://localhost:3000";
        this.log(
            "press any key to continue the deployment using your browser..."
        );
        await this.keypress();
        await open(`${baseUrl}?cid=${cid}`, { app: { name: "google chrome" } });
        process.exit(0);
    }
}
