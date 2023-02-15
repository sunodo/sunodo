import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { Static } from "@sinclair/typebox";
import { FastifyContext } from "../../types";
import buildServer from "../../utils/server";
import { ListAppSchema } from "../../../src/modules/apps/apps.schemas";
import { createTestUser } from "../../utils/user";
import { AccountType, PrismaClient } from "@prisma/client";
import { token } from "../../auth";
import { createTestApplication } from "../../utils/application";
import { createTestOrganization } from "../../utils/organization";

describe("apps:list", () => {
    beforeAll(buildServer);
    beforeAll(async (ctx) => {
        // create personal plan
        const prisma: PrismaClient = ctx.meta.prisma;
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
        await createTestApplication(prisma, {
            name: "app-1",
            accountId: user1.accountId,
        });
        await createTestApplication(prisma, {
            name: "app-2",
            accountId: user1.accountId,
        });
        await createTestApplication(prisma, {
            name: "app-3",
            accountId: user2.accountId,
        });
        await createTestApplication(prisma, {
            name: "app-4",
            accountId: org1.accountId,
        });
        await createTestApplication(prisma, {
            name: "app-5",
            accountId: org2.accountId,
        });

        beforeEach<FastifyContext>(async (ctx) => {
            ctx.plan = plan;
        });
        return async () => {
            await prisma.$transaction([
                prisma.application.deleteMany(),
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
            url: "/apps",
            method: "GET",
        });

        expect(response.statusCode).toEqual(401);
    });

    test<FastifyContext>("user apps", async (ctx) => {
        const response = await ctx.server.inject({
            url: "/apps",
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(200);
        const body = JSON.parse(response.body) as Static<
            (typeof ListAppSchema.response)[200]
        >;
        expect(body.map((a) => a.name)).toEqual(["app-1", "app-2"]);
    });

    test<FastifyContext>("org apps", async (ctx) => {
        const response = await ctx.server.inject({
            url: "/apps",
            query: { org: "org-1" },
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(200);
        const body = JSON.parse(response.body) as Static<
            (typeof ListAppSchema.response)[200]
        >;
        expect(body.map((a) => a.name)).toEqual(["app-4"]);
    });

    test<FastifyContext>("not a member of org", async (ctx) => {
        const response = await ctx.server.inject({
            url: "/apps",
            query: { org: "org-2" },
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(200);
        const body = JSON.parse(response.body) as Static<
            (typeof ListAppSchema.response)[200]
        >;
        expect(body.map((a) => a.name)).toEqual([]);
    });
});
