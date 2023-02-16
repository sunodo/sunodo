import open from "open";
import { errors, TokenSet } from "openid-client";
import enquirer from "enquirer";
import ora from "ora";
import c from "ansi-colors";

import { authClient } from "../../services/auth.js";
import { SunodoCommand } from "../../sunodoCommand.js";
import { login } from "../../services/sunodo.js";

export default class AuthLogin extends SunodoCommand {
    static aliases = ["login"];

    static description = "Login or Signup to Sunodo";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    public async run(): Promise<void> {
        const client = await authClient();

        // Device Authorization Request - https://tools.ietf.org/html/rfc8628#section-3.1
        const handle = await client.deviceAuthorization({
            scope: "email offline_access openid profile",
            audience: "https://api.sunodo.io",
        });

        // Device Authorization Response - https://tools.ietf.org/html/rfc8628#section-3.2
        const { verification_uri_complete, user_code, expires_in } = handle;

        // User Interaction - https://tools.ietf.org/html/rfc8628#section-3.3
        // XXX: use expires_in to show a countdown?
        const { url } = await enquirer.prompt<{ url: string }>({
            name: "url",
            message: `Verify code ${user_code} <press enter>`,
            type: "input",
            initial: verification_uri_complete,
        });

        // opens the verification_uri_complete URL using the system-register handler for web links (browser)
        open(url);

        const spinner = ora("Waiting for device confirmation...").start();

        // Device Access Token Request - https://tools.ietf.org/html/rfc8628#section-3.4
        // Device Access Token Response - https://tools.ietf.org/html/rfc8628#section-3.5
        let tokens: TokenSet | undefined;
        try {
            tokens = await handle.poll();
        } catch (err: any) {
            switch (err.error) {
                case "access_denied": // end-user declined the device confirmation prompt, consent or rules failed
                    spinner.fail("Authentication canceled");
                    break;
                case "expired_token": // end-user did not complete the interaction in time
                    spinner.fail("Authentication expired");
                    break;
                default:
                    if (err instanceof errors.OPError) {
                        spinner.fail(
                            `error = ${err.error}; error_description = ${err.error_description}`
                        );
                    } else {
                        throw err;
                    }
            }
        }

        if (tokens && tokens.access_token) {
            // call API /auth/login
            const response = await login({
                ...this.fetchConfig,
                headers: { Authorization: `Bearer ${tokens.access_token}` },
            });

            if (response.status != 200) {
                spinner.fail(`Authentication failed: ${response.data.message}`);
            } else {
                const email = response.data.email;
                spinner.succeed(`Logged in as ${c.cyan(email)}`);

                // save tokens locally
                this.saveToken(tokens);

                // open subscription page if needs to subscribe
                if (response.data.subscription?.url) {
                    await enquirer.prompt({
                        name: "subscribe",
                        message: `<press enter> to subscribe`,
                        type: "input",
                        initial: response.data.subscription.url,
                    });
                    open(response.data.subscription.url);
                }
            }
        }
    }
}
