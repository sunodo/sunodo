import { Type } from "@sinclair/typebox";
import { ErrorSchema } from "../../schemas";

const InviteSchema = Type.Object({ email: Type.String() });

export const CreateInviteResponseSchema = InviteSchema;

export const CreateInviteRequestSchema = InviteSchema;

export const CreateInviteSchema = {
    summary: "Invite user to organization",
    body: CreateInviteRequestSchema,
    response: {
        201: CreateInviteResponseSchema,
        400: ErrorSchema,
        401: ErrorSchema,
    },
    params: Type.Object({ slug: Type.String() }),
};

export const ListInviteSchema = {
    summary: "List invites",
    response: {
        200: Type.Array(InviteSchema),
        401: ErrorSchema,
    },
    params: Type.Object({ slug: Type.String() }),
};

export const GetInviteSchema = {
    summary: "Get invite",
    response: {
        200: InviteSchema,
        401: ErrorSchema,
        404: ErrorSchema,
    },
    params: Type.Object({ slug: Type.String(), email: Type.String() }),
};

export const DeleteInviteSchema = {
    summary: "Cancel invite",
    response: {
        204: Type.Object({}),
        401: ErrorSchema,
        404: ErrorSchema,
    },
    params: Type.Object({ slug: Type.String(), email: Type.String() }),
};
