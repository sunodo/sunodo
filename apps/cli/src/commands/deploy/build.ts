import { Flags } from "@oclif/core";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import { tmpNameSync } from "tmp";
import { URL } from "url";

import { BaseCommand } from "../../baseCommand.js";

export default class DeployBuild extends BaseCommand<typeof DeployBuild> {
    static summary = "Build deployment Docker image of application.";

    static description =
        "Package the application in a Docker image ready to be deployed.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = {
        platform: Flags.string({
            options: ["linux/amd64", "linux/arm64"],
            summary: "Docker image target platform",
            description:
                "Select the target platform for the produced Docker image. It depends on the platform where the application node will be deployed.",
        }),
    };

    private async buildRollupsImage(platform?: string) {
        const buildResult = tmpNameSync();
        const imagePath = path.join(".sunodo", "image");
        const binPath = path.join(
            path.dirname(new URL(import.meta.url).pathname),
            "..",
            "..",
        );
        const dockerfile = path.join(binPath, "node", "DockerfileDeploy.txt");
        const args = [
            "buildx",
            "build",
            "-f",
            dockerfile,
            "--load",
            "--iidfile",
            buildResult,
            imagePath,
        ];

        // optional platform, default to not defining, which will build for the host platform
        if (platform) {
            args.push("--platform", platform);
        }

        await execa("docker", args, { stdio: "inherit" });
        return fs.readFileSync(buildResult, "utf8");
    }

    public async run(): Promise<string> {
        const { flags } = await this.parse(DeployBuild);

        // print machine hash
        const templateHash = this.getMachineHash();
        if (!templateHash) {
            this.error(
                `Cartesi machine snapshot not found, run '${this.config.bin} build'`,
            );
        }
        this.logPrompt({
            title: "Cartesi machine templateHash",
            value: templateHash,
        });
        this.log("Building application node Docker image...");

        const image = await this.buildRollupsImage(flags.platform);
        this.logPrompt({
            title: "Application node Docker image",
            value: image,
        });

        return image;
    }
}
