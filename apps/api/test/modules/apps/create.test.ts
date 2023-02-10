import { PrismaClient, User } from "@prisma/client";
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

describe("apps:create", () => {
    let creator: User;

    beforeAll(buildServer);
    beforeEach<FastifyContext>(async (ctx) => {
        ctx.prisma = ctx.meta.suite.meta?.prisma;
        ctx.server = ctx.meta.suite.meta?.server;
    });
    beforeAll(async (ctx) => {
        const prisma: PrismaClient = ctx.meta.prisma;

        // create user which is creator of app
        creator = await prisma.user.create({
            data: {
                email: "admin@sunodo.io",
                name: "Sunodo Administrator",
                createdAt: new Date(),
                subs: ["1234567890"],
            },
        });
    });

    afterEach<FastifyContext>(async (ctx) => {
        await ctx.prisma.application.deleteMany();
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
                creatorId: creator.id,
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
