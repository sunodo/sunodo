import { BaseCommand } from "../baseCommand.js";

export default class AddressBook extends BaseCommand<typeof AddressBook> {
    static summary = "Prints addresses of smart contracts deployed.";

    static description =
        "Prints the addresses of all smart contracts deployed to the runtime environment of the application.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    public async run(): Promise<void> {
        this.error(
            "Sunodo CLI is deprecated, please uninstall it and install Cartesi CLI",
        );
    }
}
