import {
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    test,
} from "vitest";
import { Error } from "../../../src/schemas";
import { token } from "../../auth";
import { CreateOrgResponse } from "../../../src/modules/orgs/orgs.schemas";
import buildServer from "../../utils/server";
import { FastifyContext } from "../../types";

describe("orgs:create", () => {
    beforeAll(buildServer);

    beforeEach<FastifyContext>(async (ctx) => {
        ctx.prisma = ctx.meta.suite.meta?.prisma;
        ctx.server = ctx.meta.suite.meta?.server;
    });

    afterEach<FastifyContext>(async (ctx) => {
        await ctx.prisma.$transaction([
            ctx.prisma.application.deleteMany(),
            ctx.prisma.organizationMember.deleteMany(),
            ctx.prisma.organization.deleteMany(),
            ctx.prisma.user.deleteMany(),
        ]);
    });

    test<FastifyContext>("no name and slug", async (ctx) => {
        const response = await ctx.server.inject({
            method: "POST",
            url: "/orgs",
            payload: {},
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        expect(response.statusCode).toEqual(400);
        expect(response.statusMessage).toEqual("Bad Request");
        expect(response.json()).toEqual<Error>({
            statusCode: 400,
            error: "Bad Request",
            message:
                "body/name Expected required property, body/slug Expected required property, body/name Expected string, body/slug Expected string",
        });
    });

    test<FastifyContext>("success", async (ctx) => {
        const user = await ctx.server.prisma.user.create({
            data: {
                name: "John Doe",
                email: "john.doe@sunodo.io",
                subs: "1234567890",
            },
        });

        const response = await ctx.server.inject({
            method: "POST",
            url: "/orgs",
            payload: {
                name: "My Organization",
                slug: "my-organization",
            },
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        expect(response.statusCode).toEqual(201);
        expect(response.statusMessage).toEqual("Created");
        expect(response.json()).toEqual<CreateOrgResponse>({
            name: "My Organization",
            slug: "my-organization",
        });

        const created = await ctx.server.prisma.organization.findUnique({
            where: {
                name: "My Organization",
            },
        });
        expect(created?.name).toEqual("My Organization");
        expect(created?.slug).toEqual("my-organization");
    });

    test<FastifyContext>("existing name", async (ctx) => {
        // XXX: remove this from here
        await ctx.server.prisma.user.create({
            data: {
                name: "John Doe",
                email: "john.doe@sunodo.io",
                subs: "1234567890",
            },
        });

        // create organization with same name
        await ctx.server.prisma.organization.create({
            data: {
                name: "My Organization",
                slug: "different-slug",
            },
        });

        const response = await ctx.server.inject({
            method: "POST",
            url: "/orgs",
            payload: {
                name: "My Organization",
                slug: "my-organization",
            },
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        expect(response.statusCode).toEqual(400);
        expect(response.statusMessage).toEqual("Bad Request");
        expect(response.json()).toEqual<Error>({
            statusCode: 400,
            message: "Organization with same 'name' already exists",
            error: "P2002",
        });
    });

    test<FastifyContext>("existing slug", async (ctx) => {
        // XXX: remove this from here
        await ctx.server.prisma.user.create({
            data: {
                name: "John Doe",
                email: "john.doe@sunodo.io",
                subs: "1234567890",
            },
        });

        // create organization with same slug
        await ctx.server.prisma.organization.create({
            data: {
                name: "Different Name",
                slug: "my-organization",
            },
        });

        const response = await ctx.server.inject({
            method: "POST",
            url: "/orgs",
            payload: {
                name: "My Organization",
                slug: "my-organization",
            },
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        expect(response.statusCode).toEqual(400);
        expect(response.statusMessage).toEqual("Bad Request");
        expect(response.json()).toEqual<Error>({
            statusCode: 400,
            message: "Organization with same 'slug' already exists",
            error: "P2002",
        });
    });
});
