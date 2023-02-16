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
    operationId: "createOrganization",
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
    operationId: "listOrganizations",
    response: {
        200: ListOrgResponseSchema,
        401: ErrorSchema,
    },
};

export const GetOrgSchema = {
    summary: "Get organization",
    operationId: "getOrganization",
    response: {
        200: OrgSchema,
        401: ErrorSchema,
        404: ErrorSchema,
    },
    params: Type.Object({ slug: Type.String() }),
};

export const DeleteOrgSchema = {
    summary: "Delete organization",
    operationId: "deleteOrganization",
    response: {
        204: Type.Object({}),
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
    },
    params: Type.Object({ slug: Type.String() }),
};
