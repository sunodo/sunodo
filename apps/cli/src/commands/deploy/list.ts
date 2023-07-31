import path from "path";
import fs from "fs-extra";
import chalk from "chalk";

import { DeployBaseCommand, Deployment } from "./index.js";
import * as CustomFlags from "../../flags.js";
import { chains } from "../../wallet.js";

export default class DeployList extends DeployBaseCommand<typeof DeployList> {
    static summary = "List deployments of the application.";

    static enableJsonFlag = true;

    static description =
        "List all deployments done of the application to live networks.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = {
        network: CustomFlags.chain({
            summary: "network to list the deployments",
            options: chains.map((c) => c.network),
            chains,
            required: true,
        }),
    };

    public async run(): Promise<Deployment[]> {
        const { network } = this.flags;
        const filename = path.join(
            ".sunodo",
            "deployments",
            `${network.id}.json`,
        );

        const deployments = fs.existsSync(filename)
            ? (JSON.parse(fs.readFileSync(filename).toString()) as Deployment[])
            : [];

        if (!this.jsonEnabled()) {
            deployments.forEach((deployment, index) => {
                const txt: string[][] = [];
                txt.push(["Address", deployment.address]);
                txt.push(["Transaction", deployment.transaction]);
                txt.push(["Owner", deployment.owner]);
                txt.push(["Consensus", deployment.consensus]);
                txt.push(["Template Hash", deployment.templateHash]);
                txt.push(["Location", deployment.location]);
                const col0 = txt.reduce(
                    (w, line) => Math.max(w, line[0].length),
                    0,
                );
                const col1 = txt.reduce(
                    (w, line) => Math.max(w, line[1].length),
                    0,
                );
                txt.forEach(([title, value]) => {
                    this.log(
                        `${chalk.bold(title.padEnd(col0))} ${chalk.cyan(
                            value,
                        )}`,
                    );
                });

                // extra line for separation between entries
                index < deployments.length - 1 &&
                    this.log("-".repeat(col0 + col1 + 1));
            });
        }
        // return (as json)
        return deployments;
    }
}
