import { Type } from "@sinclair/typebox";
import { ErrorSchema } from "../../schemas";

const AppSchema = Type.Object({
    name: Type.String({
        description:
            "Name of application, default to generated name if not defined",
        examples: ["echo-python"],
    }),
});

export const CreateAppRequestSchema = Type.Object({
    name: Type.Optional(AppSchema.properties.name),
    org: Type.Optional(Type.String()),
});

export const CreateAppResponseSchema = AppSchema;

export const CreateAppSchema = {
    summary: "Create application",
    body: CreateAppRequestSchema,
    response: {
        201: CreateAppResponseSchema,
        400: ErrorSchema,
        401: ErrorSchema,
    },
    security: [{ openId: [] }],
};

export const DeleteAppSchema = {
    summary: "Delete application",
    response: {
        204: Type.Object({}),
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
    },
    params: Type.Object({ name: Type.String() }),
};

export const ListAppSchema = {
    summary: "List applications",
    querystring: Type.Object({
        org: Type.Optional(
            Type.String({
                description: "organization filter",
                examples: ["sunodo"],
            })
        ),
    }),
    response: { 200: Type.Array(AppSchema) },
};

export const GetAppSchema = {
    summary: "Get application",
    response: {
        200: AppSchema,
        401: ErrorSchema,
        404: ErrorSchema,
    },
    params: Type.Object({ name: Type.String() }),
};
