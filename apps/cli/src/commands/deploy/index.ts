import confirm from "@inquirer/confirm";
import select from "@inquirer/select";
import { Flags } from "@oclif/core";
import chalk from "chalk";
import open, { apps } from "open";
import { URL } from "url";

import { BaseCommand } from "../../baseCommand.js";

export default class Deploy extends BaseCommand<typeof Deploy> {
    static summary = "Deploy application to a live network.";

    static description =
        "Package and deploy the application to a supported live network.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = {
        hosting: Flags.string({
            options: ["self-hosted", "third-party"] as const,
            summary: "hosting type",
            description:
                "Select wheather the user will host an application node himself, or use a third-party node provider",
        }),
        webapp: Flags.url({
            description: "address of sunodo webapp",
            default: new URL("https://sunodo.io/deploy"),
            hidden: true,
        }),
    };

    public async run(): Promise<void> {
        const { flags } = await this.parse(Deploy);

        // print machine hash
        const templateHash = this.getMachineHash();
        if (!templateHash) {
            this.error(
                "Cartesi machine snapshot not found, run 'sunodo build'",
            );
        }
        this.logPrompt({
            title: "Cartesi machine templateHash",
            value: templateHash,
        });

        // ask for deployment type
        const hosting =
            flags.hosting ||
            (await select<"self-hosted" | "third-party">({
                message: "Select hosting type",
                choices: [
                    {
                        name: "Self-hosting",
                        description: `Select this option if you want to run the node for your application.
You will need the following infrastructure:

- a cloud server for the application node
- a postgres database
- a web3 node provider
- a funded wallet
`,
                        value: "self-hosted",
                    },
                    {
                        name: "Use third-party provider",
                        description:
                            "Select this option to use a third-party service provider to run a node for your application.",
                        value: "third-party",
                        disabled: "(coming soon)",
                    },
                ],
            }));

        let queryString = "";
        switch (hosting) {
            case "self-hosted": {
                // build docker image
                await this.config.runCommand("deploy:build");

                queryString = `?templateHash=${templateHash}`;
                break;
            }
            case "third-party": {
                this.error("Third-party provider deployment not supported yet");
            }
        }

        // prompt user to open webapp for onchain deployment
        const deployUrl = `${flags.webapp}${queryString}`;
        if (await confirm({ message: `Open ${chalk.cyan(deployUrl)}?` })) {
            open(deployUrl, { app: { name: apps.chrome } });
        }

        return;
    }
}
