import middy from "@middy/core";
import { PrismaClient } from "@prisma/client";
import { APIGatewayProxyResultV2 } from "aws-lambda";
import { APIGatewayProxyEventV2WithUser } from "./auth";

export interface UserMiddlewareOptions {
    prisma: PrismaClient;
}

const middleware = (
    options: UserMiddlewareOptions
): middy.MiddlewareObj<
    APIGatewayProxyEventV2WithUser,
    APIGatewayProxyResultV2
> => {
    const { prisma } = options;
    const before: middy.MiddlewareFn<
        APIGatewayProxyEventV2WithUser,
        APIGatewayProxyResultV2
    > = async (request): Promise<void> => {
        // read "sub" claim from JWT token
        const sub = request.event.requestContext.authorizer.jwt.claims[
            "sub"
        ] as string;

        // search for user with that claim (created during /auth/login)
        const user = await prisma.user.findFirst({
            where: {
                subs: {
                    has: sub,
                },
            },
        });

        // set user object in request context
        request.event.requestContext.user = user;
    };

    return {
        before,
    };
};

export default middleware;
