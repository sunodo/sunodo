import fs from "fs-extra";
import colors from "colors";
import open from "open";

import { authClient, authPath, clientId, issuer } from "../auth";
colors.enable();

export const handler = async () => {
    const auth = fs.readJsonSync(authPath);
    if (!auth) {
        console.log(`not logged in`.yellow);
        return;
    }

    // revoke stored refresh_token
    const client = await authClient();
    client.revoke(auth.refresh_token, "refresh_token");

    // delete credentials
    fs.removeSync(authPath);

    // logout application by opening logout URL
    open(`${issuer}/v2/logout?client_id=${clientId}`);

    console.log(`logged out`.gray);
};
