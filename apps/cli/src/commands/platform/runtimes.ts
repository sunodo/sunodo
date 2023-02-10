import { Flags, ux } from "@oclif/core";
import { getRuntimes } from "../../services/sunodo.js";
import { SunodoCommand } from "../../sunodoCommand.js";

export default class PlatformRuntimes extends SunodoCommand {
    static description = "list runtimes supported by the platform";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = {
        ...ux.table.flags(),
        live: Flags.string({
            description: "include only live production chains",
        }),
    };

    public async run(): Promise<void> {
        const { flags } = await this.parse(PlatformRuntimes);
        const { data } = await getRuntimes(this.fetchConfig);
        ux.table(
            data,
            {
                name: {},
            },
            { ...flags }
        );
    }
}
