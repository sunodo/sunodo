import { RouteHandlerMethod } from "fastify";

import { authService } from "./auth.services";
import prisma from "../../utils/prisma";

export const loginHandler: RouteHandlerMethod = async (request, reply) => {
    const sub = request.user.sub;

    // search for the user with that sub
    let user = await prisma.user.findFirst({
        where: {
            subs: {
                has: sub,
            },
        },
    });

    if (!user) {
        // user with that sub (subject) not found
        // create one (or update if there is already one with the same email)

        // XXX: this is ugly, what is a prettier way?
        const accessToken = request.headers["authorization"]?.split(" ")[1];

        // get id token for user, to get additional information (email and name)
        const userInfo = await authService.getUserInfo(accessToken!);
        const { email, name } = userInfo;

        if (!email || !name) {
            // id token don't have email and name, does not allow to log in
            return reply.code(401).send({
                error: "Unauthorized",
                message:
                    "User did not provide access to email and name properties",
            });
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

    return reply.code(200).send(user);
};
