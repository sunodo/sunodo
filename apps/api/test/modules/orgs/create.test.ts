import {
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    test,
} from "vitest";
import { AccountType } from "@prisma/client";

import { Error } from "../../../src/schemas";
import { token } from "../../auth";
import { CreateOrgResponse } from "../../../src/modules/orgs/orgs.schemas";
import buildServer from "../../utils/server";
import { FastifyContext } from "../../types";
import { createTestUser } from "../../utils/user";
import { createTestOrganization } from "../../utils/organization";

describe("orgs:create", () => {
    beforeAll(buildServer);
    beforeAll(async (ctx) => {
        // create personal plan
        const prisma = ctx.meta.prisma;
        const plan = await prisma.plan.create({
            data: {
                default: true,
                accountTypes: [AccountType.ORGANIZATION],
                name: "business",
                label: "Business Plan",
                stripePriceId: "price_1Ma2ZjHytG4GeYTNxFTYvRbP",
            },
        });
        ctx.meta.plan = plan;
    });

    beforeEach<FastifyContext>(async (ctx) => {
        ctx.plan = ctx.meta.suite.meta?.plan;
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
        const user = await createTestUser(ctx, {
            name: "John Doe",
            email: "john.doe@sunodo.io",
            subs: ["1234567890"],
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
        const admin = await createTestUser(ctx, {
            name: "John Doe",
            email: "john.doe@sunodo.io",
            subs: ["1234567890"],
        });

        // create organization with same name
        await createTestOrganization(ctx, {
            name: "My Organization",
            slug: "different-slug",
            admin,
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
        const admin = await createTestUser(ctx, {
            name: "John Doe",
            email: "john.doe@sunodo.io",
            subs: ["1234567890"],
        });

        // create organization with same slug
        await createTestOrganization(ctx, {
            name: "Different Name",
            slug: "my-organization",
            admin,
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
