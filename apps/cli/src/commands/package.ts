import { Command, Flags } from "@oclif/core";
import chalk from "chalk";
import path from "path";

import { packageDirectory } from "../ipfs.js";

export default class Package extends Command {
    static summary = "Package application Cartesi machine.";

    static description =
        "Package application Cartesi machine as CAR file for IPFS publishing.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = {
        output: Flags.file({
            description: "output file",
        }),
    };

    public async run(): Promise<void> {
        const { flags } = await this.parse(Package);

        // XXX: check if .sunodo/image directory exists
        const snapshot = path.join(".sunodo", "image");
        const output = flags.output ?? path.join(".sunodo", "image.car");
        const cid = await packageDirectory(snapshot, output);

        this.log(`Package ${chalk.cyan(output)}`);
        this.log(`CID ${chalk.cyan(cid)}`);
    }
}
