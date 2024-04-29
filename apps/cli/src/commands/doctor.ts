import { BaseCommand } from "../baseCommand.js";

export default class DoctorCommand extends BaseCommand<typeof DoctorCommand> {
    static description = "Verify the minimal sytem requirements";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    public async run() {
        this.error(
            "Sunodo CLI is deprecated, please uninstall it and install Cartesi CLI",
        );
    }
}
