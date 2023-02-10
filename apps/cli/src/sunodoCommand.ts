import fs from "fs-extra";
import path from "path";
import { Command, Config } from "@oclif/core";
import { TokenSet } from "openid-client";
import { RequestOpts } from "oazapfts/lib/runtime/index.js";

export abstract class SunodoCommand extends Command {
    protected fetchConfig: RequestOpts;

    private authPath: string;

    protected loadToken(): TokenSet | undefined {
        if (fs.existsSync(this.authPath)) {
            return fs.readJsonSync(this.authPath) as TokenSet;
        }
    }

    protected saveToken(tokens: TokenSet) {
        fs.outputJsonSync(this.authPath, tokens, {
            spaces: 4, // pretty print
            mode: 0o600, // rw only for user
        });
    }

    protected deleteToken() {
        // delete credentials
        fs.removeSync(this.authPath);
    }

    protected constructor(argv: string[], config: Config) {
        super(argv, config);

        // path of authentication storage
        this.authPath = path.join(this.config.configDir, "auth.json");

        // baseUrl for the Sunodo API
        const baseUrl = process.env.DEFAULT_API_URL;

        // load tokens (if they exist)
        const tokens = this.loadToken();

        // setup authentication header
        const headers = tokens
            ? { Authorization: `Bearer ${tokens.access_token}` }
            : {};

        // setup FetchConfig
        this.fetchConfig = {
            baseUrl,
            headers,
        };
    }
}
