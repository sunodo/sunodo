import { AccountType } from "@prisma/client";
import { beforeAll, describe, expect, test } from "vitest";
import { FastifyContext } from "../../types";
import { createTestOrganization } from "../../utils/organization";
import buildServer from "../../utils/server";
import { createTestUser } from "../../utils/user";

describe("orgs:list", () => {
    beforeAll(buildServer);

    beforeAll(async (ctx) => {
        // create personal plan
        const prisma = ctx.meta.prisma;
        const plan = await prisma.plan.create({
            data: {
                default: true,
                accountTypes: [AccountType.USER],
                name: "personal",
                label: "Personal Plan",
                stripePriceId: "price_1MZzQqHytG4GeYTNTUrZstr3",
            },
        });

        // test scenario:
        // user1 -> app-1, app-2
        // user2 -> app-3
        // user1 -> org-1 -> app-4
        // user2 -> org-2 -> app-5
        // create logged in user
        const tctx: FastifyContext = {
            prisma,
            server: ctx.meta.server,
            billing: ctx.meta.billing,
            stripe: ctx.meta.stripe,
            plan: plan,
        };
        const user1 = await createTestUser(tctx, {
            email: "admin@sunodo.io",
            name: "Sunodo Administrator",
            subs: ["1234567890"],
        });
        const user2 = await createTestUser(tctx, {
            email: "contact@sunodo.io",
            name: "Sunodo Contact",
            subs: ["12345678"],
        });
        const org1 = await createTestOrganization(tctx, {
            name: "Org 1",
            slug: "org-1",
            admin: user1,
        });
        const org2 = await createTestOrganization(tctx, {
            name: "Org 2",
            slug: "org-2",
            admin: user2,
        });
        return async () => {
            await prisma.$transaction([
                prisma.organizationMember.deleteMany(),
                prisma.organization.deleteMany(),
                prisma.user.deleteMany(),
                prisma.account.deleteMany(),
                prisma.plan.deleteMany(),
            ]);
        };
    });

    test<FastifyContext>("unauthorized", async (ctx) => {
        const response = await ctx.server.inject({
            url: "/orgs",
            method: "GET",
        });

        expect(response.statusCode).toEqual(401);
    });
});
