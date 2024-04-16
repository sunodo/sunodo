import { Args, Command, Flags } from "@oclif/core";
import chalk from "chalk";
import { DownloadTemplateResult, downloadTemplate } from "giget";
import ora from "ora";

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
            default: "",
        }),
        repository: Flags.string({
            description: `Define a different repository to use. Supports GitHub, GitLab, bitbucket and sourcehut. Example: --repository https://github.com/sunodo/sunodo-templates`,
        }),
    };

    private async download(
        template: string,
        branch: string,
        out: string,
        repository?: string,
    ): Promise<DownloadTemplateResult> {
        let source;

        if (repository) {
            // The URL should be in the format "github:owner/repo", "gitlab:owner/repo", etc.
            if (repository.includes("github.com")) {
                repository = repository.replace(
                    "https://github.com/",
                    "github:",
                );
            } else if (repository.includes("gitlab.com")) {
                repository = repository.replace(
                    "https://gitlab.com/",
                    "gitlab:",
                );
            } else if (repository.includes("bitbucket.org")) {
                repository = repository.replace(
                    "https://bitbucket.org/",
                    "bitbucket:",
                );
            } else if (repository.includes("sourcehut.org")) {
                repository = repository.replace(
                    "https://sourcehut.org/",
                    "sourcehut:",
                );
            } else {
                throw new Error("Unsupported repository host");
            }
            source = `${repository}/${template}#${branch} || "main"}`;
        } else {
            source = `github:sunodo/sunodo-templates/${template}#${branch} || DEFAULT_TEMPLATES_BRANCH}`;
        }

        return downloadTemplate(source, {
            dir: out,
        });
    }

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(CreateCommand);
        const spinner = ora("Creating application...").start();
        try {
            const { dir } = await this.download(
                flags.template,
                flags.branch,
                args.name,
                flags.repository,
            );
            spinner.succeed(`Application created at ${chalk.cyan(dir)}`);
        } catch (e: unknown) {
            spinner.fail(
                e instanceof Error
                    ? `Error creating application: ${chalk.red(e.message)}`
                    : String(e),
            );
        }
    }
}
