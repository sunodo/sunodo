import middy from "@middy/core";
import httpHeaderNormalizer from "@middy/http-header-normalizer";

import { APIGatewayProxyHandlerV2WithUser } from "./auth";
import userLoader from "./userLoader";
import prisma from "./prisma";
import secretsManager from "@middy/secrets-manager";

export type MeResponse = {
    email: string;
    name: string;
};

export const baseHandler: APIGatewayProxyHandlerV2WithUser<MeResponse> = async (
    event
) => {
    const user = event.requestContext.user;

    if (!user) {
        return {
            statusCode: 401,
        };
    }

    return {
        email: user.email,
        name: user.name,
    };
};

export const handler = middy(baseHandler)
    .use(httpHeaderNormalizer())
    .use(
        secretsManager({
            fetchData: {},
            setToContext: true,
        })
    )
    .use(
        userLoader({
            prisma,
        })
    );
