import ora from "ora";
import c from "ansi-colors";

import { SunodoCommand } from "../../sunodoCommand.js";
import { deleteOrganization } from "../../services/sunodo.js";
import { Args } from "@oclif/core";

export default class DeleteOrganization extends SunodoCommand {
    static description = "Delete organization";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static args = { name: Args.string({ required: true }) };

    public async run(): Promise<void> {
        const { args } = await this.parse(DeleteOrganization);

        const spinner = ora("Deleting organization...").start();
        const { data, status } = await deleteOrganization(
            args.name,
            this.fetchConfig
        );
        if (status === 204) {
            spinner.succeed(`Organization deleted: ${c.red(args.name)}`);
        } else {
            spinner.fail(`Error deleting organization: ${c.red(data.message)}`);
        }
    }
}
