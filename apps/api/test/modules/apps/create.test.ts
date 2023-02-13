import { AccountType, PrismaClient, User } from "@prisma/client";
import { Static } from "@sinclair/typebox";
import {
    beforeAll,
    beforeEach,
    afterAll,
    afterEach,
    describe,
    expect,
    test,
} from "vitest";

import { CreateAppResponseSchema } from "../../../src/modules/apps/apps.schemas";
import { Error } from "../../../src/schemas";
import { token } from "../../auth";
import { FastifyContext } from "../../types";
import buildServer from "../../utils/server";
import { createTestUser } from "../../utils/user";

describe("apps:create", () => {
    let creator: User;

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
        ctx.meta.plan = plan;
    });

    beforeEach<FastifyContext>(async (ctx) => {
        ctx.plan = ctx.meta.suite.meta?.plan;
    });

    beforeEach<FastifyContext>(async (ctx) => {
        // create user which is creator of app
        creator = await createTestUser(ctx, {
            email: "admin@sunodo.io",
            name: "Sunodo Administrator",
            subs: ["1234567890"],
        });
    });

    afterEach<FastifyContext>(async (ctx) => {
        await ctx.prisma.application.deleteMany();
        await ctx.prisma.user.deleteMany();
        await ctx.prisma.account.deleteMany();
    });

    afterAll(async (ctx) => {
        const prisma: PrismaClient = ctx.meta.prisma;
        await prisma.user.deleteMany();
    });

    test<FastifyContext>("generated name", async (ctx) => {
        const response = await ctx.server.inject({
            method: "POST",
            url: "/apps",
            payload: {},
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        expect(response.statusCode).toEqual(200);
        const app = response.json<Static<typeof CreateAppResponseSchema>>();
        expect(app.name).toBeDefined();
    });

    test<FastifyContext>("specified name", async (ctx) => {
        const response = await ctx.server.inject({
            method: "POST",
            url: "/apps",
            payload: {
                name: ctx.meta.id,
            },
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        expect(response.statusCode).toEqual(200);
        const app = response.json<Static<typeof CreateAppResponseSchema>>();
        expect(app.name).toEqual(ctx.meta.id);
    });

    test<FastifyContext>("existing name", async (ctx) => {
        // create app
        const app = await ctx.prisma.application.create({
            data: {
                name: ctx.meta.id,
                account: { connect: { id: creator.accountId } },
            },
        });

        const response = await ctx.server.inject({
            method: "POST",
            url: "/apps",
            payload: {
                name: ctx.meta.id,
            },
            headers: {
                authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(400);
        expect(response.statusMessage).toEqual("Bad Request");
        expect(response.json()).toEqual<Error>({
            statusCode: 400,
            error: "P2002",
            message: "Application with same 'name' already exists",
        });
    });
});
