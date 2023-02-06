import open from "open";
import { authClient, clientId, issuer } from "../../services/auth";
import { SunodoCommand } from "../../sunodoCommand";

export default class AuthLogout extends SunodoCommand {
    static description =
        "clears local login credentials and invalidates API session";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    public async run(): Promise<void> {
        const token = this.loadToken();
        if (!token) {
            this.warn("not logged in");
            return;
        }

        if (token.refresh_token) {
            // revoke stored refresh_token
            const client = await authClient();
            client.revoke(token.refresh_token, "refresh_token");
        }

        // delete credentials
        this.deleteToken();

        // logout application by opening logout URL
        open(`${issuer}/v2/logout?client_id=${clientId}`);

        this.log("logged out");
    }
}
