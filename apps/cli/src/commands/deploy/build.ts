import { BaseCommand } from "../../baseCommand.js";

export default class DeployBuild extends BaseCommand<typeof DeployBuild> {
    static summary = "Build deployment Docker image of application.";

    static description =
        "Package the application in a Docker image ready to be deployed.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    public async run(): Promise<string> {
        this.error(
            "Sunodo CLI is deprecated, please uninstall it and install Cartesi CLI",
        );
    }
}
