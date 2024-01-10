import { Args, Command, Flags } from "@oclif/core";
import c from "ansi-colors";
import crypto from "crypto";
import { execa } from "execa";
import fs from "fs";
import ora from "ora";
import os from "os";
import path from "path";

export const DEFAULT_TEMPLATES_BRANCH = "sdk-0.4";

export default class CreateCommand extends Command {
    static description = "Create application";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static args = {
        name: Args.string({
            description: "application and directory name",
            required: true,
        }),
    };

    static flags = {
        template: Flags.string({
            description: "template name to use",
            required: true,
            options: [
                "cpp",
                "cpp-low-level",
                "go",
                "javascript",
                "lua",
                "python",
                "ruby",
                "rust",
                "typescript",
            ],
        }),
        branch: Flags.string({
            description: `sunodo/sunodo-templates repository branch name to use`,
            default: DEFAULT_TEMPLATES_BRANCH,
        }),
    };

    private async download(
        template: string,
        branch: string,
        out: string,
    ): Promise<void> {
        const repository = "https://github.com/sunodo/sunodo-templates.git";
        const tmpDir = fs.mkdtempSync(
            path.join(os.tmpdir(), "sunodo-create-template-"),
        );
        const rndSuffix = crypto.randomBytes(8).toString("hex").substring(0, 8);
        const dockerName = `sunodo-create-${template}-${rndSuffix}`;
        const dockerfileContent = `# syntax=docker/dockerfile:1
            FROM scratch
            ADD ${repository}#${branch}:${template} /${template}/
        `;

        fs.writeFileSync(path.join(tmpDir, "Dockerfile"), dockerfileContent);
        const dockerfilePath = path.join(tmpDir, "Dockerfile");
        await execa(
            "docker",
            ["image", "build", "-t", dockerName, "-f", dockerfilePath, tmpDir],
            { stdio: "inherit" },
        );

        const { stdout: cid } = await execa("docker", [
            "container",
            "create",
            dockerName,
            "true",
        ]);

        try {
            const fullPath = path.resolve(out);
            if (fs.existsSync(fullPath)) {
                throw new Error(`Destination ${fullPath} already exists.`);
            }
            await execa(
                "docker",
                ["container", "cp", `${cid}:/${template}/`, out],
                { stdio: "inherit" },
            );
        } finally {
            // cleanup
            await execa("docker", ["container", "rm", cid], {
                stdio: "inherit",
            });
            await execa("docker", ["image", "rm", dockerName], {
                stdio: "inherit",
            });
            fs.rmSync(tmpDir, { recursive: true });
        }
    }

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(CreateCommand);
        const spinner = ora("Creating application...").start();
        try {
            await this.download(flags.template, flags.branch, args.name);
            spinner.succeed(`Application created at ${c.cyan(args.name)}`);
        } catch (e: any) {
            spinner.fail(`Error creating application: ${c.red(e.message)}`);
        }
    }
}
