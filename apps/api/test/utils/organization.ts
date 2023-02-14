import { AccountType, Role, User } from "@prisma/client";
import { randomUUID } from "crypto";
import { FastifyContext } from "../types";

export const createTestOrganization = async (
    ctx: FastifyContext,
    args: { name: string; slug: string; admin: User }
) => {
    const id = randomUUID();
    const customerId = await ctx.billing.createCustomer({ name: args.name });

    // create user
    return ctx.prisma.organization.create({
        data: {
            id,
            name: args.name,
            slug: args.slug,
            members: { create: { userId: args.admin.id, role: Role.ADMIN } },
            account: {
                create: {
                    type: AccountType.ORGANIZATION,
                    plan: { connect: { id: ctx.plan.id } },
                },
            },
            billingCustomerId: customerId,
        },
    });
};
