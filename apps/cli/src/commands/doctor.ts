import { Command } from "@oclif/core";
import { execa } from "execa";
import semver from "semver";

export default class DoctorCommand extends Command {
    static description =
        "Verify the minimal requirements for the sunodo execution commands";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    private static MINIMUM_DOCKER_VERSION = "23.0.0"; // Replace with our minimum required Docker version
    private static MINIMUM_DOCKER_COMPOSE_VERSION = "2.21.0"; // Replace with our minimum required Docker Compose version
    private static MINIMUM_BUILDX_VERSION = "0.13.0"; // Replace with our minimum required Buildx version

    private async checkDocker(): Promise<true | never> {
        try {
            let { stdout: dockerVersion } = await execa("docker", [
                "version",
                "--format",
                "{{json .Client.Version}}",
            ]);

            const v = semver.coerce(dockerVersion);
            if (
                v !== null &&
                !semver.gte(v, DoctorCommand.MINIMUM_DOCKER_VERSION)
            ) {
                throw new Error(
                    `Unsupported Docker version. Minimum required version is ${DoctorCommand.MINIMUM_DOCKER_VERSION}. Installed version is ${v}.`,
                );
            }
        } catch (e: unknown) {
            if ((e as any).code == "ENOENT") {
                throw new Error("Docker is required but not installed.");
            } else {
                throw e;
            }
        }

        return true;
    }

    private async checkCompose(): Promise<true | never> {
        try {
            const { stdout: dockerComposeVersion } = await execa("docker", [
                "compose",
                "version",
                "--short",
            ]);

            const v = semver.coerce(dockerComposeVersion);
            if (
                v !== null &&
                !semver.gte(v, DoctorCommand.MINIMUM_DOCKER_COMPOSE_VERSION)
            ) {
                throw new Error(
                    `Unsupported Docker Compose version. Minimum required version is ${DoctorCommand.MINIMUM_DOCKER_COMPOSE_VERSION}. Installed version is ${v}.`,
                );
            }
        } catch (e: unknown) {
            if ((e as any).exitCode === 125) {
                throw new Error(
                    "Docker Compose is required but not installed or the command execution failed. Please refer to the Docker Compose documentation for installation instructions: https://docs.docker.com/compose/install/",
                );
            } else {
                throw e;
            }
        }

        return true;
    }

    private async checkBuildx(): Promise<void> {
        try {
            const { stdout: buildxOutput } = await execa("docker", [
                "buildx",
                "version",
            ]);

            const v = semver.coerce(buildxOutput);
            if (
                v !== null &&
                !semver.gte(v, DoctorCommand.MINIMUM_BUILDX_VERSION)
            ) {
                throw new Error(
                    `Unsupported Docker Buildx version. Minimum required version is ${DoctorCommand.MINIMUM_BUILDX_VERSION}. Installed version is ${v}.`,
                );
            }

            const { stdout: platformsOutput } = await execa("docker", [
                "buildx",
                "ls",
                "--format",
                "{{.Platforms}}",
            ]);

            const buildxPlatforms: string[] = platformsOutput
                .split(",")
                .map((platform) => platform.trim());

            if (!buildxPlatforms.includes("linux/riscv64")) {
                throw new Error(
                    "Your system does not support riscv64 architecture. Run `docker run --privileged --rm tonistiigi/binfmt:riscv` to enable riscv64 support.",
                );
            }
        } catch (e: unknown) {
            if ((e as any).exitCode === 125) {
                throw new Error(
                    "Docker Buildx is required but not installed. Please refer to the Docker Desktop documentation for installation instructions: https://docs.docker.com/desktop/",
                );
            } else {
                throw e;
            }
        }
    }

    public async run(): Promise<void> {
        try {
            await this.checkDocker();
            await this.checkCompose();
            await this.checkBuildx();
        } catch (e: unknown) {
            this.error(e as Error);
        }

        this.log("Your system is ready for sunodo.");
    }
}
