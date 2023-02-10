import { AccountType, Role, User } from "@prisma/client";
import { randomUUID } from "crypto";
import { TestContext } from "vitest";
import { FastifyContext } from "../types";

export const createTestOrganization = async (
    ctx: TestContext & FastifyContext,
    args: { name: string; slug: string; admin: User }
) => {
    const id = randomUUID();
    const customerId = await ctx.billing.createCustomer({
        name: args.name,
        metadata: { external_id: id, test_id: ctx.meta.id },
    });

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
