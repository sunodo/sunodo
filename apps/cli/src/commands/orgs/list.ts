import { SunodoCommand } from "../../sunodoCommand.js";
import { listOrganizations } from "../../services/sunodo.js";
import { ux } from "@oclif/core";

export default class ListOrganization extends SunodoCommand {
    static description = "List organizations";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = { ...ux.table.flags() };

    public async run(): Promise<void> {
        const { flags } = await this.parse(ListOrganization);

        const { data, status } = await listOrganizations(this.fetchConfig);
        if (status === 200) {
            ux.table(data, { name: {}, slug: {} }, { ...flags });
        } else {
            this.error(data.message);
        }
    }
}
