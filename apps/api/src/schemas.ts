import { Static, Type } from "@sinclair/typebox";

export const ErrorSchema = Type.Object({
    statusCode: Type.Integer(),
    error: Type.String(),
    message: Type.String(),
});

export type Error = Static<typeof ErrorSchema>;
