import { BaseCommand } from "../baseCommand.js";

export default class Clean extends BaseCommand<typeof Clean> {
    static summary = "Clean build artifacts of application.";

    static description = "Deletes all cached build artifacts of application.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    public async run(): Promise<void> {
        this.error(
            "Sunodo CLI is deprecated, please uninstall it and install Cartesi CLI",
        );
    }
}
