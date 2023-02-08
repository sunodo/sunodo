import { Static, Type } from "@sinclair/typebox";
import { ErrorSchema } from "../../schemas";

const OrgSchema = Type.Object({
    name: Type.String(),
    slug: Type.Union([Type.Null(), Type.String()]),
});

export const CreateOrgRequestSchema = Type.Object({
    name: OrgSchema.properties.name,
    slug: Type.String(),
});
export type CreateOrgRequest = Static<typeof CreateOrgRequestSchema>;

export const CreateOrgResponseSchema = OrgSchema;
export type CreateOrgResponse = Static<typeof CreateOrgResponseSchema>;

export const CreateOrgSchema = {
    summary: "Create organization",
    body: CreateOrgRequestSchema,
    response: {
        201: CreateOrgResponseSchema,
        401: ErrorSchema,
        400: ErrorSchema,
    },
};

const ListOrgResponseSchema = Type.Array(OrgSchema);

export const ListOrgSchema = {
    summary: "List organizations",
    response: {
        200: ListOrgResponseSchema,
        401: ErrorSchema,
    },
};

export const GetOrgSchema = {
    summary: "Get organization",
    response: {
        200: OrgSchema,
        401: ErrorSchema,
        404: ErrorSchema,
    },
    params: Type.Object({
        slug: Type.String(),
    }),
};
