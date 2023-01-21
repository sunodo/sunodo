import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import { Issuer } from "openid-client";

import { authHandler, AuthorizedHandler } from "@libs/auth";
import { PrismaClient } from "../../../generated/client";

import schema from "./schema";

const prisma = new PrismaClient();
const domain = process.env.AUTH_DOMAIN;
const clientId = process.env.AUTH_CLIENT_ID;
const clientSecret = process.env.AUTH_CLIENT_SECRET;

const login: AuthorizedHandler<typeof schema> = async (event) => {
    // fetches the .well-known endpoint for endpoints, issuer value etc.
    const auth0 = await Issuer.discover(`https://${domain}`);

    // instantiates a client
    const client = new auth0.Client({
        client_id: clientId,
        client_secret: clientSecret,
        token_endpoint_auth_method: "none",
        id_token_signed_response_alg: "RS256",
    });

    // query user info from authentication provider
    const userInfo = await client.userinfo(event.auth.token);

    // and get email from user info
    const { email, name } = userInfo;

    // get user from database
    let user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        // user don't exist, sign him up
        user = await prisma.user.create({
            data: {
                email,
                name,
            },
        });
    }

    // create session for user
    const session = await prisma.session.create({
        data: {
            userId: user.id,
            accessToken: event.auth.token,
            refreshToken: event.body.refresh_token,
        },
    });

    // return session
    return {
        statusCode: 200,
        body: JSON.stringify({ email, session: session.id }),
    };
};

export const main = middy(login)
    .use(middyJsonBodyParser())
    .use(httpHeaderNormalizer())
    .use(httpErrorHandler())
    .use(authHandler());
