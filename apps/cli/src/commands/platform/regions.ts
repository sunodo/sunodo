import { Flags, ux } from "@oclif/core";
import { getRegions } from "../../services/sunodo.js";
import { SunodoCommand } from "../../sunodoCommand.js";

export default class PlatformRegions extends SunodoCommand {
    static description = "list regions supported by the platform";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = {
        ...ux.table.flags(),
        live: Flags.string({
            description: "include only live production chains",
        }),
    };

    public async run(): Promise<void> {
        const { flags } = await this.parse(PlatformRegions);
        const { data } = await getRegions(this.fetchConfig);

        ux.table(
            data,
            {
                name: {},
            },
            { ...flags }
        );
    }
}
