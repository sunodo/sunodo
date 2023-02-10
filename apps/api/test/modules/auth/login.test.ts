import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    test,
    vi,
} from "vitest";
import { AccountType, PrismaClient } from "@prisma/client";

import { authService } from "../../../src/modules/auth/__mocks__/auth.services";

vi.mock("../../../src/modules/auth/auth.services");

import { type LoginResponseBodySchema } from "../../../src/modules/auth/auth.schemas";
import { token } from "../../auth";
import buildServer from "../../utils/server";
import { FastifyContext } from "../../types";
import { createTestUser } from "../../utils/user";

describe("login", () => {
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
    afterAll(async (ctx) => {
        // create personal plan
        const prisma: PrismaClient = ctx.meta.prisma;
        await prisma.plan.deleteMany();
    });

    beforeEach<FastifyContext>(async (ctx) => {
        // copy suite context to test context
        ctx.plan = ctx.meta.suite.meta?.plan;
    });

    afterEach<FastifyContext>(async (ctx) => {
        // delete created customers from stripe
        const customers = await ctx.stripe.customers.search({
            query: `metadata["test_id"]:"${ctx.meta.id}"`,
        });
        await Promise.all(
            customers.data.map(({ id }) => ctx.stripe.customers.del(id))
        );

        await ctx.prisma.user.deleteMany();
        await ctx.prisma.account.deleteMany();
    });

    test<FastifyContext>("existing user", async (ctx) => {
        // create test user
        await createTestUser(ctx, {
            email: "admin@sunodo.io",
            name: "Sunodo Administrator",
            subs: ["1234567890"],
        });

        // just a fake token with the payload { "sub": "1234567890", "iat": 1516239022 }}
        // we need to pass fastify jwt preValidation, rest is mocked
        const response = await ctx.server.inject({
            method: "POST",
            url: "/auth/login",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(200);
        const user = JSON.parse(response.body) as LoginResponseBodySchema;
        expect(user.email).toBe("admin@sunodo.io");
    });

    test<FastifyContext>("unexisting sub, email not provided", async (ctx) => {
        // mock resolution of id token from access token (done by identity provider)
        authService.getUserInfo.mockResolvedValue({
            name: "Sunodo Administrator",
        });

        const response = await ctx.server.inject({
            method: "POST",
            url: "/auth/login",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(401);
    });

    test<FastifyContext>("unexisting sub, name not provided", async (ctx) => {
        // mock resolution of id token from access token (done by identity provider)
        authService.getUserInfo.mockResolvedValue({
            email: "admin@sunodo.io",
        });

        const response = await ctx.server.inject({
            method: "POST",
            url: "/auth/login",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(401);
    });

    test<FastifyContext>("unexisting sub, existing user", async (ctx) => {
        // but the user (by email) exists, possibly from different sub
        await createTestUser(ctx, {
            email: "admin@sunodo.io",
            name: "Sunodo Administrator",
            subs: ["github|1234567890"],
        });

        // mock resolution of id token from access token (done by identity provider)
        authService.getUserInfo.mockResolvedValue({
            email: "admin@sunodo.io",
            name: "Sunodo Administrator",
        });

        const response = await ctx.server.inject({
            method: "POST",
            url: "/auth/login",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(200);
        const user = JSON.parse(response.body) as LoginResponseBodySchema;
        expect(user.email).toBe("admin@sunodo.io");
    });

    test<FastifyContext>("unexisting sub, create user", async (ctx) => {
        // mock resolution of id token from access token (done by identity provider)
        authService.getUserInfo.mockResolvedValue({
            email: "admin@sunodo.io",
            name: "Sunodo Administrator",
        });

        const response = await ctx.server.inject({
            method: "POST",
            url: "/auth/login",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(200);
        const user = JSON.parse(response.body) as LoginResponseBodySchema;
        expect(user.email).toBe("admin@sunodo.io");
    });
});
