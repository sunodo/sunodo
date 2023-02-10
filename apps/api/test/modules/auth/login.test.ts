import {
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    test,
    vi,
} from "vitest";
import { User } from "@prisma/client";

import { authService } from "../../../src/modules/auth/__mocks__/auth.services";

vi.mock("../../../src/modules/auth/auth.services");

import { UserInfo } from "../../../src/modules/auth/auth.services";
import { token } from "../../auth";
import buildServer from "../../utils/server";
import { FastifyContext } from "../../types";

describe("login", () => {
    beforeAll(buildServer);

    beforeEach<FastifyContext>(async (ctx) => {
        ctx.prisma = ctx.meta.suite.meta?.prisma;
        ctx.server = ctx.meta.suite.meta?.server;
    });

    afterEach<FastifyContext>(async (ctx) => {
        await ctx.prisma.user.deleteMany();
    });

    test<FastifyContext>("existing user", async (ctx) => {
        await ctx.prisma.user.create({
            data: {
                email: "admin@sunodo.io",
                name: "Sunodo Administrator",
                createdAt: new Date(),
                subs: ["1234567890"],
            },
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
        const user = JSON.parse(response.body) as UserInfo;
        expect(user.email).toBe("admin@sunodo.io");
        expect(user.name).toBe("Sunodo Administrator");
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
        await ctx.prisma.user.create({
            data: {
                email: "admin@sunodo.io",
                name: "Sunodo Administrator",
                createdAt: new Date(),
                subs: ["github|1234567890"],
            },
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
        const user = JSON.parse(response.body) as User;
        expect(user.email).toBe("admin@sunodo.io");
        expect(user.subs).contains("github|1234567890");
        expect(user.subs).contains("1234567890");
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
        const user = JSON.parse(response.body) as User;
        expect(user.email).toBe("admin@sunodo.io");
        expect(user.subs).contains("1234567890");
    });
});
