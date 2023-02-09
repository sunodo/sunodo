import { beforeEach, describe, expect, test } from "vitest";
import { Error } from "../../../src/schemas";
import buildServer from "../../../src/server";
import prisma from "../../../src/utils/prisma";
import { token } from "../../auth";
import { CreateOrgResponse } from "../../../src/modules/orgs/orgs.schemas";

describe("orgs:create", () => {
    beforeEach(async () => {
        await prisma.$transaction([
            prisma.application.deleteMany(),
            prisma.organizationMember.deleteMany(),
            prisma.organization.deleteMany(),
            prisma.user.deleteMany(),
        ]);
    });

    test("no name and slug", async () => {
        const server = buildServer();
        const response = await server.inject({
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

    test("success", async () => {
        const server = buildServer();
        const user = await prisma.user.create({
            data: {
                name: "John Doe",
                email: "john.doe@sunodo.io",
                subs: "1234567890",
            },
        });

        const response = await server.inject({
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

        const created = await prisma.organization.findUnique({
            where: {
                name: "My Organization",
            },
        });
        expect(created?.name).toEqual("My Organization");
        expect(created?.slug).toEqual("my-organization");
    });

    test("existing name", async () => {
        // XXX: remove this from here
        await prisma.user.create({
            data: {
                name: "John Doe",
                email: "john.doe@sunodo.io",
                subs: "1234567890",
            },
        });

        // create organization with same name
        await prisma.organization.create({
            data: {
                name: "My Organization",
                slug: "different-slug",
            },
        });

        const server = buildServer();
        const response = await server.inject({
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

    test("existing slug", async () => {
        // XXX: remove this from here
        await prisma.user.create({
            data: {
                name: "John Doe",
                email: "john.doe@sunodo.io",
                subs: "1234567890",
            },
        });

        // create organization with same slug
        await prisma.organization.create({
            data: {
                name: "Different Name",
                slug: "my-organization",
            },
        });

        const server = buildServer();
        const response = await server.inject({
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
