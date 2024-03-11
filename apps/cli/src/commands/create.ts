import { Args, Command, Flags } from "@oclif/core";
import c from "ansi-colors";
import type { TemplateProvider } from "giget";
import { DownloadTemplateResult, downloadTemplate } from "giget";
import ora from "ora";

const DEFAULT_TEMPLATES_BRANCH = "sdk-0.2";
const DEFAULT_TEMPLATE_REPOSITORY = "https://github.com/sunodo/sunodo-templates";

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
        repository: Flags.string({
            description: `custom template repository to use`,
            default: DEFAULT_TEMPLATE_REPOSITORY
        })
    };

    private async download(
        template: string,
        out: string,
        repository: string
    ): Promise<DownloadTemplateResult> {
        const sunodoProvider: TemplateProvider = async (input) => {
            return {
                name: "sunodo",
                subdir: input,
                url: repository,
                tar: this.getTarUrl(repository),
            };
        };

        const input = `sunodo:${template}`;
        return downloadTemplate(input, {
            dir: out,
            providers: { sunodo: sunodoProvider },
        });
    }

    private getRepoCodeLoadUrl(repository: string) {
        return repository.replace("github.com", "codeload.github.com");
    }

    private getTarUrl(repository: string) {
        if (repository === DEFAULT_TEMPLATE_REPOSITORY) {
            return `${this.getRepoCodeLoadUrl(repository)}/tar.gz/refs/heads/${DEFAULT_TEMPLATES_BRANCH}`;
        }
        return `${this.getRepoCodeLoadUrl(repository)}/tar.gz/refs/heads/main`;
    }

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(CreateCommand);
        const spinner = ora("Creating application...").start();
        try {

            const { dir } = await this.download(
                flags.template,
                args.name,
                flags.repository,
            );
            spinner.succeed(`Application created at ${c.cyan(dir)}`);
        } catch (e: any) {
            spinner.fail(`Error creating application: ${c.red(e.message)}`);
        }
    }
}
