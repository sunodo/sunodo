import { Args, Flags } from "@oclif/core";
import chalk from "chalk";
import type { TemplateProvider } from "giget";
import { DownloadTemplateResult, downloadTemplate } from "giget";
import ora from "ora";
import { BaseCommand } from "../baseCommand";

export const DEFAULT_TEMPLATES_BRANCH = "sdk-0.4";

export default class CreateCommand extends BaseCommand<typeof CreateCommand> {
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
            description: `cartesi/application-templates repository branch name to use`,
            default: DEFAULT_TEMPLATES_BRANCH,
        }),
    };

    private async download(
        template: string,
        branch: string,
        out: string,
    ): Promise<DownloadTemplateResult> {
        const cartesiProvider: TemplateProvider = async (input) => {
            return {
                name: "cartesi",
                subdir: input,
                url: "https://github.com/cartesi/application-templates",
                tar: `https://codeload.github.com/cartesi/application-templates/tar.gz/refs/heads/${branch}`,
            };
        };

        const input = `cartesi:${template}`;
        return downloadTemplate(input, {
            dir: out,
            providers: { cartesi: cartesiProvider },
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
