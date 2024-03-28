import confirm from "@inquirer/confirm";
import select from "@inquirer/select";
import chalk from "chalk";
import { Command, Option, UsageError } from "clipanion";
import open, { apps } from "open";
import * as t from "typanion";

import { SunodoCommand } from "../../sunodoCommand.js";

export default class Deploy extends SunodoCommand {
    static paths = [["deploy"]];

    static usage = Command.Usage({
        description: "Deploy application to a live network.",
        details:
            "Package and deploy the application to a supported live network.",
    });

    hosting = Option.String<"self-hosted" | "third-party">("--hosting", {
        validator: t.isEnum(["self-hosted", "third-party"]),
        description: 'hosting type ("self-hosted", "third-party")',
    });

    webapp = Option.String("--webapp", {
        description: "address of sunodo webapp",
        hidden: true,
    });

    public async execute(): Promise<void> {
        // print machine hash
        const templateHash = this.getMachineHash();
        if (!templateHash) {
            throw new UsageError(
                "Cartesi machine snapshot not found, run 'sunodo build'",
            );
        }
        this.logPrompt({
            title: "Cartesi machine templateHash",
            value: templateHash,
        });

        // ask for deployment type
        const hosting =
            this.hosting ||
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
                await this.cli.run(["deploy", "build"]);

                queryString = `?templateHash=${templateHash}`;
                break;
            }
            case "third-party": {
                throw new UsageError(
                    "Third-party provider deployment not supported yet",
                );
            }
        }

        // prompt user to open webapp for onchain deployment
        const deployUrl = `${this.webapp ?? "https://sunodo.io/deploy"}${queryString}`;
        if (await confirm({ message: `Open ${chalk.cyan(deployUrl)}?` })) {
            open(deployUrl, { app: { name: apps.chrome } });
        }

        return;
    }
}
