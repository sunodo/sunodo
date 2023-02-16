import ora from "ora";
import c from "ansi-colors";

import { SunodoCommand } from "../../sunodoCommand.js";
import { createApplication } from "../../services/sunodo.js";
import { Args, Flags } from "@oclif/core";

export default class CreateApplication extends SunodoCommand {
    static description = "Create application";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static args = { name: Args.string() };

    static flags = {
        org: Flags.string({
            description: "organization slug of the application",
        }),
    };

    public async run(): Promise<void> {
        const { args } = await this.parse(CreateApplication);
        const { flags } = await this.parse(CreateApplication);

        const spinner = ora("Creating application...").start();
        const { data, status } = await createApplication(
            { name: args.name, org: flags.org },
            this.fetchConfig
        );
        if (status === 201) {
            spinner.succeed(`Application created: ${c.cyan(data.name)}`);
        } else {
            spinner.fail(`Error creating application: ${c.red(data.message)}`);
        }
    }
}
