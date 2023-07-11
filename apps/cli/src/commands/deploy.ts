import { Command, Flags } from "@oclif/core";
import path from "path";
import fs from "fs-extra";
import { create } from "kubo-rpc-client";
import open from "open";
import { Readable } from "stream";
import progress from "progress-stream";
import cliProgress from "cli-progress";
import {
    createDirectoryEncoderStream,
    CAREncoderStream,
    FileLike,
} from "ipfs-car";
import zlib from "zlib";

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
        webapp: Flags.url({
            description: "address of sunodo webapp",
            default: new URL("https://app.sunodo.io/deploy"),
            hidden: true,
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

    public async run(): Promise<void> {
        const { flags } = await this.parse(Deploy);

        const snapshot = path.join(".sunodo", "image");
        if (!fs.existsSync(snapshot) || !fs.statSync(snapshot).isDirectory()) {
            throw new Error(
                "Cartesi machine snapshot not found, run 'sunodo build'"
            );
        }

        const hash = fs
            .readFileSync(path.join(snapshot, "hash"))
            .toString("hex");

        // upload tar to IPFS, getting the CID
        const client = create({ url: flags.ipfs });

        const multibar = new cliProgress.MultiBar({
            clearOnComplete: true,
            hideCursor: true,
            autopadding: true,
            format: "{bar} | {filename} | {value}/{total}",
        });

        // @ts-expect-error node web stream not type compatible with web stream
        const files: FileLike[] = fs.readdirSync(snapshot).map((name) => {
            // get size of file
            const { size } = fs.statSync(path.join(snapshot, name));

            // create progress bar for this filse
            const bar = multibar.create(size, 0, { filename: name });

            // create stream progress
            const p = progress({ length: size, time: 100 }, (progress) =>
                bar.update(progress.transferred, { filename: name })
            );
            return {
                name,
                stream: () =>
                    Readable.toWeb(
                        fs
                            .createReadStream(path.join(snapshot, name))
                            .pipe(p)
                            .pipe(zlib.createGzip())
                    ),
            };
        });
        const result = await client.add(
            createDirectoryEncoderStream(files).pipeThrough(
                new CAREncoderStream()
            )
        );
        multibar.stop();

        const { cid } = result;
        this.log(`machine snapshot uploaded: ${cid.toString()}`);

        // open daploy webapp with CID pre-filled
        this.log(
            "press any key to continue the deployment using your browser..."
        );
        await this.keypress();
        await open(`${flags.webapp}?cid=${cid}&hash=0x${hash}`, {
            app: { name: "google chrome" },
        });
        process.exit(0);
    }
}
