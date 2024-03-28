import { Command, Option, UsageError } from "clipanion";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import { tmpNameSync } from "tmp";
import * as t from "typanion";
import { URL } from "url";

import { SunodoCommand } from "../../sunodoCommand.js";

export default class DeployBuild extends SunodoCommand {
    static paths = [["deploy", "build"]];

    static usage = Command.Usage({
        description: "Build deployment Docker image of application.",
        details:
            "Package the application in a Docker image ready to be deployed.",
    });

    platform = Option.String<"linux/amd64" | "linux/arm64">("--platform", {
        description:
            'Docker image target platform ("linux/amd64", "linux/arm64")',
        validator: t.isEnum(["linux/amd64", "linux/arm64"]),
    });

    private async buildRollupsImage() {
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
        if (this.platform) {
            args.push("--platform", this.platform);
        }

        await execa("docker", args, { stdio: "inherit" });
        return fs.readFileSync(buildResult, "utf8");
    }

    public async execute() {
        // print machine hash
        const templateHash = this.getMachineHash();
        if (!templateHash) {
            throw new UsageError(
                "Cartesi machine snapshot not found, run 'sunodo build'",
            );
        }
        this.logPrompt({
            title: "Cartesi machine templateHash",
            value: templateHash,
        });
        this.context.stdout.write(
            "Building application node Docker image...\n",
        );

        const image = await this.buildRollupsImage();
        this.logPrompt({
            title: "Application node Docker image",
            value: image,
        });

        return;
    }
}
