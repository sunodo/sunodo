import { SunodoCommand } from "../../sunodoCommand.js";
import { listApplications } from "../../services/sunodo.js";
import { Flags, ux } from "@oclif/core";

export default class ListApplication extends SunodoCommand {
    static description = "List applications";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = {
        ...ux.table.flags(),
        org: Flags.string({
            description: "organization slug of the applications",
        }),
    };

    public async run(): Promise<void> {
        const { flags } = await this.parse(ListApplication);

        const { data, status } = await listApplications(
            { org: flags.org },
            this.fetchConfig
        );
        if (status === 200) {
            ux.table(data, { name: {} }, { ...flags });
        } else {
            this.error(data.message);
        }
    }
}
