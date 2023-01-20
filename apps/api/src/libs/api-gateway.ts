import type {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Handler,
} from "aws-lambda";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";

export type ValidatedAPIGatewayProxyEvent<S extends JSONSchema> = Omit<
    APIGatewayProxyEvent,
    "body"
> & {
    body: FromSchema<S>;
};

export type ValidatedHandler<S extends JSONSchema> = Handler<
    ValidatedAPIGatewayProxyEvent<S>,
    APIGatewayProxyResult
>;

export const formatJSONResponse = (response: Record<string, unknown>) => {
    return {
        statusCode: 200,
        body: JSON.stringify(response),
    };
};
