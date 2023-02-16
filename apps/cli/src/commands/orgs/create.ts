import ora from "ora";
import c from "ansi-colors";

import { SunodoCommand } from "../../sunodoCommand.js";
import { createOrganization } from "../../services/sunodo.js";
import { Args, Flags } from "@oclif/core";

export default class CreateOrganization extends SunodoCommand {
    static description = "Create organization";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static args = { name: Args.string({ required: true }) };

    static flags = {
        slug: Flags.string({
            description: "slug of the organization",
            required: true,
        }),
    };

    public async run(): Promise<void> {
        const { args } = await this.parse(CreateOrganization);
        const { flags } = await this.parse(CreateOrganization);

        const spinner = ora("Creating application...").start();
        const { data, status } = await createOrganization(
            { name: args.name, slug: flags.slug },
            this.fetchConfig
        );
        if (status === 201) {
            spinner.succeed(`Application created: ${c.cyan(data.name)}`);
        } else {
            spinner.fail(`Error creating application: ${c.red(data.message)}`);
        }
    }
}
