import { Command } from "clipanion";
import { execa } from "execa";
import semver from "semver";

export default class DoctorCommand extends Command {
    static paths = [["doctor"]];

    static usage = Command.Usage({
        description:
            "Verify the minimal requirements for the sunodo execution commands.",
        details:
            "Check if Docker is installed and if it meets the minimum version required",
    });

    private static MINIMUM_DOCKER_VERSION = "23.0.0"; // Replace with our minimum required Docker version
    private static MINIMUM_DOCKER_COMPOSE_VERSION = "2.21.0"; // Replace with our minimum required Docker Compose version

    private static isDockerVersionValid(version: string): boolean {
        return semver.gte(version, DoctorCommand.MINIMUM_DOCKER_VERSION);
    }

    private static isDockerComposeVersionValid(version: string): boolean {
        const v = semver.coerce(version);
        return (
            v !== null &&
            semver.gte(v, DoctorCommand.MINIMUM_DOCKER_COMPOSE_VERSION)
        );
    }

    private static isBuildxRiscv64Supported(buildxOutput: string): boolean {
        return buildxOutput.includes("riscv64");
    }

    public async execute() {
        try {
            // Check Docker version
            const { stdout: dockerVersionOutput } = await execa("docker", [
                "version",
                "--format",
                "{{json .Client.Version}}",
            ]);
            const dockerVersion = JSON.parse(dockerVersionOutput);

            if (!DoctorCommand.isDockerVersionValid(dockerVersion)) {
                throw new Error(
                    `Unsupported Docker version. Minimum required version is ${DoctorCommand.MINIMUM_DOCKER_VERSION}. Installed version is ${dockerVersion}.`,
                );
            }

            // Check Docker Compose version
            const { stdout: dockerComposeVersionOutput } = await execa(
                "docker",
                ["compose", "version", "--short"],
            );
            const dockerComposeVersion = dockerComposeVersionOutput.trim();

            if (
                !DoctorCommand.isDockerComposeVersionValid(dockerComposeVersion)
            ) {
                throw new Error(
                    `Unsupported Docker Compose version. Minimum required version is ${DoctorCommand.MINIMUM_DOCKER_COMPOSE_VERSION}. Installed version is ${dockerComposeVersion}.`,
                );
            }

            // Check Docker Buildx version and riscv64 support
            const { stdout: buildxOutput } = await execa("docker", [
                "buildx",
                "ls",
            ]);
            const buildxRiscv64Supported =
                DoctorCommand.isBuildxRiscv64Supported(buildxOutput);

            if (!buildxRiscv64Supported) {
                throw new Error(
                    "Your system does not support riscv64 architecture.",
                );
            }

            this.context.stdout.write("Your system is ready for sunodo.\n");
        } catch (error: unknown) {
            if (error instanceof Error) {
                this.context.stderr.write(error.message);
            } else {
                this.context.stderr.write(String(error));
            }
        }
    }
}
