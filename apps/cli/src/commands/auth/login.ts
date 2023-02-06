import { Command, Flags } from "@oclif/core";
import open from "open";
import fs from "fs-extra";
import { errors, TokenSet } from "openid-client";
import prompts from "prompts";
import { authClient, authPath } from "../../services/auth";

export default class AuthLogin extends Command {
    static description = "Login or Signup to Sunodo";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = {
        // flag with a value (-n, --name=VALUE)
        name: Flags.string({ char: "n", description: "name to print" }),
        // flag with no value (-f, --force)
        force: Flags.boolean({ char: "f" }),
    };

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(AuthLogin);

        const client = await authClient();

        // Device Authorization Request - https://tools.ietf.org/html/rfc8628#section-3.1
        const handle = await client.deviceAuthorization({
            scope: "email offline_access openid profile",
            audience: "https://api.sunodo.io",
        });

        // Device Authorization Response - https://tools.ietf.org/html/rfc8628#section-3.2
        const { verification_uri_complete, user_code, expires_in } = handle;

        // User Interaction - https://tools.ietf.org/html/rfc8628#section-3.3
        await prompts({
            name: "open",
            type: "invisible",
            message: `Press any key to open up the browser to login or press ctrl-c to abort. You should see the following code: ${user_code}. It expires in ${
                expires_in % 60 === 0
                    ? `${expires_in / 60} minutes`
                    : `${expires_in} seconds`
            }.`,
        });

        // opens the verification_uri_complete URL using the system-register handler for web links (browser)
        open(verification_uri_complete);

        // Device Access Token Request - https://tools.ietf.org/html/rfc8628#section-3.4
        // Device Access Token Response - https://tools.ietf.org/html/rfc8628#section-3.5
        let tokens: TokenSet | undefined;
        try {
            tokens = await handle.poll();
        } catch (err: any) {
            switch (err.error) {
                case "access_denied": // end-user declined the device confirmation prompt, consent or rules failed
                    this.error("auth canceled");
                case "expired_token": // end-user did not complete the interaction in time
                    this.error("auth expired");
                    break;
                default:
                    if (err instanceof errors.OPError) {
                        this.error(
                            `error = ${err.error}; error_description = ${err.error_description}`
                        );
                    } else {
                        throw err;
                    }
            }
        }

        if (tokens && tokens.access_token) {
            await fs.outputJson(authPath, tokens, {
                spaces: 4, // pretty print
                mode: 0o600, // rw only for user
            });

            // XXX: call /auth/login
            this.log(`logged in`);
        }
    }
}
