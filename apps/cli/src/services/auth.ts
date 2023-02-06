import os from "os";
import path from "path";
import { Issuer, BaseClient } from "openid-client";

export const issuer = process.env.AUTH_ISSUER!;
export const clientId = process.env.AUTH_CLIENT_ID!;

export const authPath = path.join(os.homedir(), ".sunodo", "auth.json");

export const authClient = async (): Promise<BaseClient> => {
    // fetches the .well-known endpoint for endpoints, issuer value etc.
    const auth0 = await Issuer.discover(issuer);

    // instantiates a client
    const client = new auth0.Client({
        client_id: clientId,
        token_endpoint_auth_method: "none",
        id_token_signed_response_alg: "RS256",
    });

    return client;
};
