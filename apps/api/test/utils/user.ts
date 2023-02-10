import { AccountType } from "@prisma/client";
import { TestContext } from "vitest";
import { FastifyContext } from "../types";

export const createTestUser = async (
    ctx: TestContext & FastifyContext,
    args: { email: string; name: string; subs: string[] }
) => {
    const customerId = await ctx.billing.createCustomer({
        email: args.email,
        metadata: { test_id: ctx.meta.id },
    });

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
    });
};
