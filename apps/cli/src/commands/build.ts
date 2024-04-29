import { BaseCommand } from "../baseCommand.js";

export default class BuildApplication extends BaseCommand<
    typeof BuildApplication
> {
    static summary = "Build application.";

    static description =
        "Build application starting from a Dockerfile and ending with a snapshot of the corresponding Cartesi Machine already booted and yielded for the first time. This snapshot can be used to start a Cartesi node for the application using `sunodo run`. The process can also start from a Docker image built by the developer using `docker build` using the option `--from-image`";

    static examples = [
        "<%= config.bin %> <%= command.id %>",
        "<%= config.bin %> <%= command.id %> --from-image my-app",
    ];

    public async run(): Promise<void> {
        this.error(
            "Sunodo CLI is deprecated, please uninstall it and install Cartesi CLI",
        );
    }
}
