import { Command } from "@oclif/core";
import fs from "fs-extra";
import open from "open";
import { authClient, authPath, clientId, issuer } from "../../services/auth";

export default class AuthLogout extends Command {
    static description =
        "clears local login credentials and invalidates API session";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    public async run(): Promise<void> {
        const auth = fs.readJsonSync(authPath);
        if (!auth) {
            this.warn("not logged in");
            return;
        }

        // revoke stored refresh_token
        const client = await authClient();
        client.revoke(auth.refresh_token, "refresh_token");

        // delete credentials
        fs.removeSync(authPath);

        // logout application by opening logout URL
        open(`${issuer}/v2/logout?client_id=${clientId}`);

        this.log("logged out");
    }
}
