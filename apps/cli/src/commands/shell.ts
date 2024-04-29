import { Args } from "@oclif/core";
import { BaseCommand } from "../baseCommand.js";

export default class Shell extends BaseCommand<typeof Shell> {
    static description = "Start a shell in cartesi machine of application";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static args = {
        image: Args.string({
            description: "image ID|name",
            required: false,
        }),
    };

    public async run(): Promise<void> {
        this.error(
            "Sunodo CLI is deprecated, please uninstall it and install Cartesi CLI",
        );
    }
}
