import type { ValidatedHandler } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";

const hello: ValidatedHandler<typeof schema> = async (event) => {
    return formatJSONResponse({
        message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
        event,
    });
};

export const main = middyfy(hello);
