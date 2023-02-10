import { Flags, ux } from "@oclif/core";
import { getChains } from "../../services/sunodo.js";
import { SunodoCommand } from "../../sunodoCommand.js";

export default class PlatformChains extends SunodoCommand {
    static description = "list chains supported by the platform";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = {
        ...ux.table.flags(),
        live: Flags.string({
            description: "include only live production chains",
        }),
    };

    public async run(): Promise<void> {
        const { flags } = await this.parse(PlatformChains);
        const { data } = await getChains(this.fetchConfig);
        ux.table(
            data,
            {
                id: {},
                name: {},
                label: {},
                testnet: { get: (v) => (v ? "✔" : "") },
                enabled: { get: (v) => (v ? "✔" : "") },
            },
            { ...flags }
        );
    }
}
