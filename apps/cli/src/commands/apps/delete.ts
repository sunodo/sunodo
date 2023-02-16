import ora from "ora";
import c from "ansi-colors";

import { SunodoCommand } from "../../sunodoCommand.js";
import { deleteApplication } from "../../services/sunodo.js";
import { Args } from "@oclif/core";

export default class DeleteApplication extends SunodoCommand {
    static description = "Delete application";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static args = { name: Args.string({ required: true }) };

    public async run(): Promise<void> {
        const { args } = await this.parse(DeleteApplication);

        const spinner = ora("Deleting application...").start();
        const { data, status } = await deleteApplication(
            args.name,
            this.fetchConfig
        );
        if (status === 204) {
            spinner.succeed(`Application deleted: ${c.red(args.name)}`);
        } else {
            spinner.fail(`Error deleting application: ${c.red(data.message)}`);
        }
    }
}
