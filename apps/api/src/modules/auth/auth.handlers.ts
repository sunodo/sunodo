import { AccountType } from "@prisma/client";
import { randomUUID } from "crypto";

import { authService } from "./auth.services";
import { LoginSchema } from "./auth.schemas";
import { RouteHandlerMethodTypebox } from "../../types";

export const loginHandler: RouteHandlerMethodTypebox<
    typeof LoginSchema
> = async (request, reply) => {
    const sub = request.user.sub;

    // search for the user with that sub
    let user = await request.prisma.user.findFirst({
        where: { subs: { has: sub } },
        include: { account: { include: { plan: true } } },
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
                statusCode: 401,
                error: "Unauthorized",
                message:
                    "User did not provide access to email and name properties",
            });
        }

        // search again for user using email
        user = await request.prisma.user.findUnique({
            where: { email },
            include: { account: { include: { plan: true } } },
        });

        if (user) {
            // found user by email, just add the sub to that
            // also update the name, in case it changed
            user = await request.prisma.user.update({
                where: { email },
                data: { name, subs: { push: sub } },
                include: { account: { include: { plan: true } } },
            });
        } else {
            // could not find user, create it now, along with user account
            const id = randomUUID();

            // search for default plan of user account, throw error if not configured
            const plan = await request.prisma.plan.findFirstOrThrow({
                where: {
                    accountTypes: { has: AccountType.USER },
                    default: true,
                },
            });

            // create stripe customer
            const customerId = await request.server.billing.createCustomer({
                email,
                name,
                description: name,
                metadata: { external_id: id },
            });

            // create user entity
            user = await request.prisma.user.create({
                data: {
                    id,
                    email,
                    name,
                    subs: [sub],
                    account: {
                        create: {
                            id,
                            type: AccountType.USER,
                            plan: { connect: { id: plan.id } },
                        },
                    },
                    billingCustomerId: customerId,
                },
                include: {
                    account: { include: { plan: true } },
                },
            });
        }
    }

    // handle stripe subscription
    if (!user.account.billingSubscriptionId) {
        // create a checkout session using the configured plan as the stripe price object
        const checkoutUrl = await request.server.billing.createCheckoutUrl({
            account: user.account,
            email: user.email,
        });

        return reply
            .code(200)
            .send({ email: user.email, subscription: { url: checkoutUrl } });
    } else {
        return reply.code(200).send({ email: user.email });
    }
};
