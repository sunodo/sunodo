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

export default class Download extends Command {
    static summary = "Download application from IPFS.";

    static description = "Download IPFS .";

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

    public async run(): Promise<void> {
        const { flags } = await this.parse(Download);

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
    }
}
