import { APIGatewayProxyHandlerV2WithJWTAuthorizer } from "aws-lambda";
import prisma from "./prisma";

export type MeResponse = {
    email: string;
    name: string;
};

export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer<
    MeResponse
> = async (event) => {
    const sub = event.requestContext.authorizer.jwt.claims["sub"] as string;
    const user = await prisma.user.findFirst({
        where: {
            subs: {
                has: sub,
            },
        },
    });

    if (!user) {
        return {
            statusCode: 401,
        };
    }

    return {
        email: user.email,
        name: user.name,
    };
};
