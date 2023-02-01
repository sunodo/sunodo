import { User } from "@prisma/client";
import {
    APIGatewayEventRequestContextJWTAuthorizer,
    APIGatewayEventRequestContextV2WithAuthorizer,
    APIGatewayProxyEventV2WithRequestContext,
    APIGatewayProxyResultV2,
    Handler,
} from "aws-lambda";
import { Issuer } from "openid-client";

/**
 * User Payload
 */
export interface APIGatewayEventRequestContextUser
    extends APIGatewayEventRequestContextV2WithAuthorizer<APIGatewayEventRequestContextJWTAuthorizer> {
    user: User | null;
}

export type APIGatewayProxyEventV2WithUser =
    APIGatewayProxyEventV2WithRequestContext<
        APIGatewayEventRequestContextV2WithAuthorizer<APIGatewayEventRequestContextJWTAuthorizer> &
            APIGatewayEventRequestContextUser
    >;

export type APIGatewayProxyHandlerV2WithUser<T = never> = Handler<
    APIGatewayProxyEventV2WithUser,
    APIGatewayProxyResultV2<T>
>;

export interface AuthProps {
    issuer: string;
    clientId: string;
    clientSecret: string;
}

export type UserInfo = {
    email: string;
    name: string;
};

export interface AuthService {
    getUserInfo(accessToken: string): UserInfo | Promise<UserInfo>;
}

export class JWSAuthService implements AuthService {
    config: AuthProps;
    constructor(config: AuthProps) {
        this.config = config;
    }

    async getUserInfo(accessToken: string): Promise<UserInfo> {
        // fetches the .well-known endpoint for endpoints, issuer value etc.
        const auth0 = await Issuer.discover(this.config.issuer);

        // instantiates a client
        const client = new auth0.Client({
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
        });

        // query user info from authentication provider
        return client.userinfo<UserInfo>(accessToken);
    }
}

const authService = new JWSAuthService({
    issuer: process.env.AUTH_ISSUER!,
    clientId: process.env.AUTH_CLIENT_ID!,
    clientSecret: process.env.AUTH_CLIENT_SECRET!,
});

export default authService;
