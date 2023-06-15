import { Command, Flags } from "@oclif/core";
import path from "path";
import fs from "fs-extra";
import Handlebars from "handlebars";
import slugify from "slugify";
import DocsHelp from "../docs.js";

export default class Docs extends Command {
    static summary = "Generate documentation for the CLI.";

    static description =
        "Process a set of handlebars templates with information from the CLI commands with the goal to generate documentation.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static hidden = true;

    static flags = {
        "template-dir": Flags.directory({
            description: "The directory containing the handlebars templates.",
            required: true,
        }),
        "output-dir": Flags.directory({
            description: "The directory to output the generated files to.",
            required: true,
        }),
    };

    public async run(): Promise<void> {
        const { flags } = await this.parse(Docs);
        const help = new DocsHelp(this.config, {
            stripAnsi: true,
            maxWidth: 120,
        });

        const templateDir = flags["template-dir"];
        const outputDir = flags["output-dir"];
        fs.ensureDirSync(outputDir);

        const slugifyCommand = (id: string) => slugify(id.replace(":", "-"));
        Handlebars.registerHelper("slugify", slugifyCommand);

        const templateFiles = await fs.readdir(templateDir);
        const templateData = help.completeData();

        this.log(`processing templates from ${templateDir} to ${outputDir}`);
        await Promise.all(
            templateFiles.map(async (templateFile) => {
                const template = await fs.readFile(
                    path.join(templateDir, templateFile),
                    "utf-8"
                );
                const compiledTemplate = Handlebars.compile(template);

                if (templateFile.indexOf("{{command}}") >= 0) {
                    this.config.commandIDs.forEach((id) => {
                        const outputFile = templateFile
                            .replace("{{command}}", slugifyCommand(id))
                            .replace(/\.hbs$/, "");
                        this.log(`processing ${templateFile} -> ${outputFile}`);

                        const commandData = help.commandData(id);
                        const output = compiledTemplate(commandData);
                        fs.writeFileSync(
                            path.join(outputDir, outputFile),
                            output
                        );
                    });
                } else {
                    const outputFile = templateFile.replace(/\.hbs$/, "");
                    this.log(`processing ${templateFile} -> ${outputFile}`);
                    const output = compiledTemplate(templateData);
                    await fs.writeFile(
                        path.join(outputDir, outputFile),
                        output
                    );
                }
            })
        );
    }
}
