import { authHandler, AuthorizedHandler } from "@libs/auth";
import { formatJSONResponse } from "@libs/api-gateway";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import middyJsonBodyParser from "@middy/http-json-body-parser";

const me: AuthorizedHandler<{}> = async (event) => {
    return formatJSONResponse({ email: event.auth.payload.email });
};

export const main = middy(me)
    .use(middyJsonBodyParser())
    .use(httpHeaderNormalizer())
    .use(httpErrorHandler())
    .use(authHandler());
