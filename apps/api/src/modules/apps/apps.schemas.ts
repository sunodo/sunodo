import { Static, Type } from "@sinclair/typebox";
import { ErrorSchema } from "../../schemas";

export const CreateAppRequestSchema = Type.Object({
    name: Type.Optional(
        Type.String({
            description:
                "Name of application, default to generated name if not defined",
            examples: "echo-python",
        })
    ),
    org: Type.Optional(Type.String()),
});
export type CreateAppRequest = Static<typeof CreateAppRequestSchema>;

export const CreateAppResponseSchema = Type.Object({
    name: Type.String(),
});
export type CreateAppResponse = Static<typeof CreateAppResponseSchema>;

export const CreateAppSchema = {
    body: CreateAppRequestSchema,
    response: {
        201: CreateAppResponseSchema,
        400: ErrorSchema,
    },
};

export const GetAppSchema = {
    response: {
        200: Type.Object({
            name: Type.String(),
        }),
        404: ErrorSchema,
    },
    params: Type.Object({
        name: Type.String(),
    }),
};
