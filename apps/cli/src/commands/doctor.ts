import { Command } from "@oclif/core";
import { execa } from "execa";
import semver from "semver";

export default class DoctorCommand extends Command {
    static description =
        "Verify the minimal requirements for the sunodo execution commands";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    private static MINIMUM_DOCKER_VERSION = "23.0.0"; // Replace with our minimum required Docker version
    private static MINIMUM_DOCKER_COMPOSE_VERSION = "2.21.0"; // Replace with our minimum required Docker Compose version
    private static MINIMUM_ANVIL_VERSION = "0.2.0"; // Replace with our minimum required Anvil version

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

    private static isAnvilVersionValid(version: string): boolean {
        return semver.gte(version, DoctorCommand.MINIMUM_ANVIL_VERSION);
    }

    private static isBuildxRiscv64Supported(buildxOutput: string): boolean {
        return buildxOutput.includes("riscv64");
    }

    public async run() {
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

            // Check Anvil version
            const { stdout: anvilVersionOutput } = await execa("anvil", [
                "--version",
            ]);
            const parts = anvilVersionOutput.trim().split(" "); // Split the output by spaces
            const anvilVersion = parts.length >= 2 ? parts[1] : "";

            if (!DoctorCommand.isAnvilVersionValid(anvilVersion)) {
                throw new Error(
                    `Unsupported Anvil version. Minimum required version is ${DoctorCommand.MINIMUM_ANVIL_VERSION}. Installed version is ${anvilVersion}.`,
                );
            }

            this.log("Your system is ready for sunodo.");
        } catch (error: unknown) {
            if (error instanceof Error) {
                this.error(error.message);
            } else {
                this.error(String(error));
            }
        }
    }
}
