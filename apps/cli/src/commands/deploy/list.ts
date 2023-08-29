import { Flags } from "@oclif/core";
import chalk from "chalk";
import { foundry } from "viem/chains";

import { DeployBaseCommand, Deployment } from "./index.js";
import { supportedChains } from "../../wallet.js";

export default class DeployList extends DeployBaseCommand<typeof DeployList> {
    static summary = "List deployments of the application.";

    static enableJsonFlag = true;

    static description =
        "List all deployments done of the application to live networks.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = {
        "chain-id": Flags.integer({
            summary: "network to list the deployments",
            options: supportedChains.map((c) => c.id.toString()),
        }),
    };

    public async run(): Promise<Deployment[]> {
        let deployments = this.getDeployments();

        if (this.flags["chain-id"]) {
            // filter by network
            deployments = deployments.filter(
                (deployment) => deployment.chainId === this.flags["chain-id"],
            );
        }

        if (!this.jsonEnabled()) {
            if (deployments.length > 0) {
                deployments.forEach((deployment, index) => {
                    const chain = [...supportedChains, foundry].find(
                        (c) => c.id === deployment.chainId,
                    );

                    const txt: string[][] = [];
                    txt.push(["Address", deployment.address]);
                    txt.push(["Network", `${chain ? chain.name : ""}`]);
                    txt.push(["Transaction", deployment.transaction]);
                    txt.push(["Owner", deployment.owner]);
                    txt.push(["Factory", deployment.factory]);
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
            } else {
                this.log("No deployments");
            }
        }
        // return (as json)
        return deployments;
    }
}
