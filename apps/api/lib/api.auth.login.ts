import { APIGatewayProxyHandlerV2WithJWTAuthorizer } from "aws-lambda";
import prisma from "./prisma";
import authService, { UserInfo } from "./auth";

export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer<
    UserInfo
> = async (event) => {
    // read sub claim from JWT
    const sub = event.requestContext.authorizer.jwt.claims["sub"] as string;

    // search for the user with that sub
    let user = await prisma.user.findFirst({
        where: {
            subs: {
                has: sub,
            },
        },
    });

    if (!user) {
        // XXX: this is ugly, what is a prettier way?
        const accessToken = event.headers["Authorization"]?.split(" ")[1]!;

        // get id token for user, to get additional information (email and name)
        const userInfo = await authService.getUserInfo(accessToken);
        const { email, name } = userInfo;

        if (!email || !name) {
            // id token don't have email and name, does not allow to log in
            return {
                statusCode: 401,
            };
        }

        // search again for user using email
        user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (user) {
            // found user by email, just add the sub to that
            user = await prisma.user.update({
                where: {
                    email,
                },
                data: {
                    name, // also update the name, in case it changed
                    subs: {
                        push: sub,
                    },
                },
            });
        } else {
            // could not find user, create it
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    subs: [sub],
                },
            });
        }
    }

    return user;
};
