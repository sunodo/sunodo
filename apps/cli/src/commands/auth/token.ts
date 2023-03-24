import { SunodoCommand } from "../../sunodoCommand.js";

export default class AuthToken extends SunodoCommand {
    static aliases = ["token"];

    static description = "Prints current saved token (if authenticated)";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    public async run(): Promise<void> {
        const tokens = this.loadToken();
        if (tokens?.access_token) {
            process.stdout.write(tokens.access_token);
        } else {
            process.stderr.write("not authenticated");
        }
    }
}
