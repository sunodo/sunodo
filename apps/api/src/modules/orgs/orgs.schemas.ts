import { Static, Type } from "@sinclair/typebox";
import { ErrorSchema } from "../../schemas";

export const CreateOrgRequestSchema = Type.Object({
    name: Type.String(),
    slug: Type.Optional(Type.String()),
});
export type CreateOrgRequest = Static<typeof CreateOrgRequestSchema>;

export const CreateOrgResponseSchema = Type.Object({
    name: Type.String(),
    slug: Type.String(),
});
export type CreateOrgResponse = Static<typeof CreateOrgResponseSchema>;

export const CreateOrgSchema = {
    body: CreateOrgRequestSchema,
    response: {
        201: CreateOrgResponseSchema,
        400: ErrorSchema,
    },
};
