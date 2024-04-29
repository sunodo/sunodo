import { BaseCommand } from "../baseCommand.js";

export const DEFAULT_TEMPLATES_BRANCH = "sdk-0.4";

export default class CreateCommand extends BaseCommand<typeof CreateCommand> {
    static description = "Create application";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    public async run(): Promise<void> {
        this.error(
            "Sunodo CLI is deprecated, please uninstall it and install Cartesi CLI",
        );
    }
}
