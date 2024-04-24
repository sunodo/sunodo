import fs from "fs-extra";
import path from "path";
import { BaseCommand } from "../baseCommand";

export default class Clean extends BaseCommand<typeof Clean> {
    static summary = "Clean build artifacts of application.";

    static description = "Deletes all cached build artifacts of application.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    public async run(): Promise<void> {
        await fs.emptyDir(path.join(".sunodo"));
    }
}
