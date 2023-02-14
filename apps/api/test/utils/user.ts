import { AccountType } from "@prisma/client";
import { FastifyContext } from "../types";

export const createTestUser = async (
    ctx: FastifyContext,
    args: { email: string; name: string; subs: string[] }
) => {
    const customerId = await ctx.billing.createCustomer({ email: args.email });

    // create user
    return ctx.prisma.user.create({
        data: {
            email: args.email,
            name: args.name,
            subs: args.subs,
            account: {
                create: {
                    type: AccountType.USER,
                    plan: { connect: { id: ctx.plan.id } },
                },
            },
            billingCustomerId: customerId,
        },
        include: { account: true },
    });
};
