import { BaseCommand } from "../../baseCommand.js";

export default class Deploy extends BaseCommand<typeof Deploy> {
    static summary = "Deploy application to a live network.";

    static description =
        "Package and deploy the application to a supported live network.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    public async run(): Promise<void> {
        this.error(
            "Sunodo CLI is deprecated, please uninstall it and install Cartesi CLI",
        );
    }
}
