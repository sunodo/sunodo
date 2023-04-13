import ora from "ora";
import c from "ansi-colors";
import { Args, Command, Flags } from "@oclif/core";
import { DownloadTemplateResult, downloadTemplate } from "giget";
import type { TemplateProvider } from "giget";

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
            options: ["javascript"],
        }),
        branch: Flags.string({
            description: "branch name to use if not main",
            default: "main",
        }),
    };

    private async download(
        template: string,
        branch: string,
        out: string
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

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(CreateCommand);
        const spinner = ora("Creating application...").start();
        try {
            const { dir } = await this.download(
                flags.template,
                flags.branch,
                args.name
            );
            spinner.succeed(`Application created at ${c.cyan(dir)}`);
        } catch (e: any) {
            spinner.fail(`Error creating application: ${c.red(e.message)}`);
        }
    }
}
