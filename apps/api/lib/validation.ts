import { APIGatewayProxyResultV2, Handler } from "aws-lambda";
import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { APIGatewayProxyEventV2WithUser } from "./auth";

export type ValidatedAPIGatewayProxyEvent<S extends JSONSchema> = Omit<
    APIGatewayProxyEventV2WithUser,
    "body"
> & {
    body: FromSchema<S>;
};

export type ValidatedHandler<S extends JSONSchema, T = never> = Handler<
    ValidatedAPIGatewayProxyEvent<S>,
    APIGatewayProxyResultV2<T>
>;
