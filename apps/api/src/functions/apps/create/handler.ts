import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import middyJsonBodyParser from "@middy/http-json-body-parser";

import { authHandler, AuthorizedHandler } from "@libs/auth";
import { formatJSONResponse } from "@libs/api-gateway";

import schema from "./schema";

const createApp: AuthorizedHandler<typeof schema> = async (event) => {
    return formatJSONResponse({
        message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
        event,
    });
};

export const main = middy(createApp)
    .use(middyJsonBodyParser())
    .use(httpHeaderNormalizer())
    .use(httpErrorHandler())
    .use(authHandler());
