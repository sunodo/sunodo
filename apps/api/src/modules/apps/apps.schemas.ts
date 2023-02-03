import { Static, Type } from "@sinclair/typebox";
import { ErrorSchema } from "../../schemas";

export const CreateAppRequestSchema = Type.Object({
    name: Type.Optional(Type.String()),
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
