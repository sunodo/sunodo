import { Static, Type } from "@sinclair/typebox";
import { ErrorSchema } from "../../schemas";

export const LoginResponseBodySchema = Type.Object({
    email: Type.String(),
    subscription: Type.Optional(
        Type.Object({
            url: Type.Union([Type.Null(), Type.String()]),
        })
    ),
});
export type LoginResponseBodySchema = Static<typeof LoginResponseBodySchema>;

export const LoginSchema = {
    summary: "Login",
    operationId: "login",
    response: {
        200: LoginResponseBodySchema,
        401: ErrorSchema,
    },
};
