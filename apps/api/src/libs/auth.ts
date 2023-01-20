import { readFileSync } from "fs";
import type { APIGatewayProxyResult, Handler } from "aws-lambda";
import JWTAuthMiddleware, {
    EncryptionAlgorithms,
} from "middy-middleware-jwt-auth";
import type { JSONSchema } from "json-schema-to-ts";
import { IAuthorizedEvent } from "middy-middleware-jwt-auth";

import { ValidatedAPIGatewayProxyEvent } from "./api-gateway";

const pem = readFileSync("./dev-0y8qxgon5zsrd7s1.pem");

export interface ITokenPayload {
    email: string;
    email_verified: boolean;
    iss: string;
    sub: string;
    aud: string;
    iat: number;
    exp: number;
}

function isTokenPayload(token: any): token is ITokenPayload {
    return (
        token != null &&
        token.email &&
        token.email_verified &&
        token.iss &&
        token.sub &&
        token.aud &&
        token.iat &&
        token.exp
    );
}

export type AuthorizedHandler<S extends JSONSchema> = Handler<
    ValidatedAPIGatewayProxyEvent<S> & IAuthorizedEvent<ITokenPayload>,
    APIGatewayProxyResult
>;

export const authHandler = (credentialsRequired: boolean = true) =>
    JWTAuthMiddleware({
        /** Algorithm to verify JSON web token signature */
        algorithm: EncryptionAlgorithms.RS256,
        /** An optional boolean that enables making authorization mandatory */
        credentialsRequired,
        /** An optional function that checks whether the token payload is formatted correctly */
        isPayload: isTokenPayload,
        /** A string or buffer containing either the secret for HMAC algorithms, or the PEM encoded public key for RSA and ECDSA */
        secretOrPublicKey: pem,
    });
