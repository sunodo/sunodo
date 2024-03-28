import chalk from "chalk";
import { Command, Option } from "clipanion";
import type { TemplateProvider } from "giget";
import { DownloadTemplateResult, downloadTemplate } from "giget";
import ora from "ora";

const DEFAULT_TEMPLATES_BRANCH = "sdk-0.3";

export default class CreateCommand extends Command {
    static paths = [["create"]];

    static usage = Command.Usage({
        description: "Create application",
    });

    static examples = ["<%= config.bin %> <%= command.id %>"];

    name = Option.String();

    template = Option.String("--template", {
        description: "template name to use",
        required: true,
    });

    branch = Option.String("--branch", {
        description: `sunodo/sunodo-templates repository branch name to use`,
    });

    private async download(
        template: string,
        branch: string,
        out: string,
    ): Promise<DownloadTemplateResult> {
        const sunodoProvider: TemplateProvider = async (input) => {
            return {
                name: "sunodo",
                subdir: input,
                url: "https://github.com/sunodo/sunodo-templates",
                tar: `https://codeload.github.com/sunodo/sunodo-templates/tar.gz/refs/heads/${branch}`,
            };
        };

        const input = `sunodo:${template}`;
        return downloadTemplate(input, {
            dir: out,
            providers: { sunodo: sunodoProvider },
        });
    }

    public async execute(): Promise<void> {
        const spinner = ora("Creating application...").start();
        try {
            const { dir } = await this.download(
                this.template,
                this.branch || DEFAULT_TEMPLATES_BRANCH,
                this.name,
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
