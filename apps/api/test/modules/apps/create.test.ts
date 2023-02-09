import { Static } from "@sinclair/typebox";
import { beforeEach, describe, expect, test } from "vitest";
import { CreateAppResponseSchema } from "../../../src/modules/apps/apps.schemas";
import { Error } from "../../../src/schemas";
import buildServer from "../../../src/server";
import prisma from "../../../src/utils/prisma";
import { token } from "../../auth";

describe("apps:create", () => {
    beforeEach(async () => {
        await prisma.$transaction([prisma.application.deleteMany()]);
    });

    test("generated name", async () => {
        const server = buildServer();
        const response = await server.inject({
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

    test("specified name", async () => {
        const server = buildServer();
        const response = await server.inject({
            method: "POST",
            url: "/apps",
            payload: {
                name: "poker",
            },
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        expect(response.statusCode).toEqual(200);
        const app = response.json<Static<typeof CreateAppResponseSchema>>();
        expect(app.name).toEqual("poker");
    });

    test("existing name", async (ctx) => {
        // create user, creator of app
        const user = await prisma.user.create({
            data: {
                name: ctx.meta.id,
                email: `${ctx.meta.id}@gmail.com`,
            },
        });
        // create app
        const app = await prisma.application.create({
            data: {
                name: ctx.meta.id,
                creatorId: user.id,
            },
        });

        const server = buildServer();
        const response = await server.inject({
            method: "POST",
            url: "/apps",
            payload: {
                name: ctx.meta.id,
            },
            headers: {
                authorization: `Bearer ${token}`,
            },
        });

        // delete created entities
        await prisma.application.delete({ where: { id: app.id } });
        await prisma.user.delete({ where: { id: user.id } });

        expect(response.statusCode).toEqual(400);
        expect(response.statusMessage).toEqual("Bad Request");
        expect(response.json()).toEqual<Error>({
            statusCode: 400,
            error: "P2002",
            message: "Application with same 'name' already exists",
        });
    });
});
