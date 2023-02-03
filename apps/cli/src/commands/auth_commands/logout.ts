import fs from "fs-extra";
import colors from "colors";
import axios from "axios";

import { authClient, authPath, clientId, issuer } from "../auth";
import fetch from "node-fetch";
colors.enable();

export const handler = async () => {
    const auth = fs.readJsonSync(authPath);
    if (!auth) {
        console.log(`not logged in`.yellow);
        return;
    }

    // logout application by calling logout URL
    const logoutUrl = `${issuer}/v2/logout?client_id=${clientId}`;
    await axios.get(logoutUrl);

    // revoke stored refresh_token
    const client = await authClient();
    client.revoke(auth.refresh_token, "refresh_token");

    // delete credentials
    fs.removeSync(authPath);

    console.log(`logged out`.gray);
};
