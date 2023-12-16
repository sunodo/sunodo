import { confirm } from "@inquirer/prompts";
import { Flags } from "@oclif/core";
import chalk from "chalk";
import open from "open";
import path from "path";
import { URL } from "url";

import { SunodoCommand } from "../sunodoCommand.js";
import deploy from "../deploy.js";

export default class Deploy extends SunodoCommand<typeof Deploy> {
    static summary = "Deploy application to a live network.";

    static description =
        "Package, upload and deploy the application to a supported network.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = {
        "ipfs-url": Flags.url({
            summary:
                "address of IPFS node to upload the cartesi machine snapshot",
            helpGroup: "IPFS",
        }),
        "ipfs-username": Flags.string({
            summay: "username for IPFS node",
            helpGroup: "IPFS",
        }),
        "ipfs-password": Flags.string({
            summary: "password for IPFS node",
            helpGroup: "IPFS",
        }),
        webapp: Flags.url({
            description: "address of sunodo webapp",
            default: new URL("https://sunodo.io/deploy"),
            hidden: true,
        }),
    };

    public async run(): Promise<void> {
        const { flags } = await this.parse(Deploy);

        const snapshot = path.join(".sunodo", "image");
        const { location } = await deploy(snapshot, {
            url: flags["ipfs-url"],
            username: flags["ipfs-username"],
            password: flags["ipfs-password"],
        });

        const deployUrl = `${flags.webapp}?cid=${location}`;
        if (
            await confirm({
                message: `Open ${chalk.cyan(deployUrl)}?`,
            })
        ) {
            open(deployUrl, { app: { name: "google chrome" } });
        }
    }
}
