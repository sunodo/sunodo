import { afterEach, beforeEach } from "vitest";
import { createSigner, PrivateKey, SignerOptions } from "fast-jwt";
import { readFileSync } from "fs";
import { EOL } from "os";
import path from "path";
import nock from "nock";

const issuer = process.env.AUTH_ISSUER!; // https://dev-0y8qxgon5zsrd7s1.us.auth0.com

const readPEM = (filepath: string): string => {
    const str = readFileSync(filepath, "utf8");
    const lines = str.split(EOL);
    return lines.slice(1, -2).join(EOL);
};

/*
How to regenerate the keys for RS256:
ssh-keygen -t rsa -b 4096 -m PEM -f private.key
openssl req -x509 -new -key private.key -out public.key -subj "/CN=unused"
*/

const jwks = {
    keys: [
        {
            alg: "RS512",
            kid: "KEY",
            x5c: ["UNUSED"],
        },
        {
            alg: "RS256",
            kid: "KEY",
            x5c: [readPEM(path.join("test", "keys", "public.key"))],
        },
    ],
};

const generateToken = (
    options: Partial<
        SignerOptions & {
            key: string | Buffer | PrivateKey;
        }
    >,
    payload: { [key: string]: any }
) => {
    const signSync = createSigner(options);
    return signSync(payload);
};

export const token = generateToken(
    {
        key: readFileSync(path.join("test", "keys", "private.key"), "utf8"),
        noTimestamp: true,
        iss: issuer,
        aud: ["https://api.sunodo.io", `${issuer}userinfo`],
        kid: "KEY",
    },
    {
        admin: true,
        name: "John Doe",
        sub: "1234567890",
    }
);

beforeEach(() => {
    nock.disableNetConnect();
    nock.enableNetConnect(/api.stripe.com/);
    nock(issuer).get("/.well-known/jwks.json").reply(200, jwks);
});

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});
