import { describe, expect, test, vi } from "vitest";
import { Error } from "../../../src/schemas";
import buildServer from "../../../src/server";
import { token } from "../../auth";
import prisma from "../../../src/utils/__mocks__/prisma";
import { OrganizationType, Prisma } from "@prisma/client";
import { CreateOrgResponse } from "../../../src/modules/orgs/orgs.schemas";

vi.mock("../../../src/utils/prisma");

describe("orgs", () => {
    test("no name", async () => {
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
                "body/name Expected required property, body/name Expected string",
        });
    });

    test("success", async () => {
        const server = buildServer();
        prisma.user.findFirst.mockResolvedValue({
            id: "1",
            name: "Sunodo Administrator",
            email: "admin@sunodo.io",
            subs: [],
            createdAt: new Date(),
        });

        prisma.organization.create.mockResolvedValue({
            id: "1",
            name: "My Organization",
            slug: "my-organization",
            type: OrganizationType.SHARED,
            createdAt: new Date(),
        });

        const response = await server.inject({
            method: "POST",
            url: "/orgs",
            payload: {
                name: "My Organization",
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
    });

    test("existing name", async () => {
        const server = buildServer();
        prisma.user.findFirst.mockResolvedValue({
            id: "1",
            name: "Sunodo Administrator",
            email: "admin@sunodo.io",
            subs: [],
            createdAt: new Date(),
        });

        prisma.organization.create.mockRejectedValue(
            new Prisma.PrismaClientKnownRequestError(
                "Unique constraint failed on the `name`",
                {
                    code: "P2002",
                    clientVersion: "4.9.0",
                    meta: { target: "name" },
                }
            )
        );

        const response = await server.inject({
            method: "POST",
            url: "/orgs",
            payload: {
                name: "My Organization",
            },
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        expect(response.statusCode).toEqual(400);
        expect(response.statusMessage).toEqual("Bad Request");
        expect(response.json()).toEqual<Error>({
            statusCode: 400,
            message: "Unique constraint failed on the `name`",
            error: "P2002",
        });
    });

    test("existing slug", async () => {
        const server = buildServer();
        prisma.user.findFirst.mockResolvedValue({
            id: "1",
            name: "Sunodo Administrator",
            email: "admin@sunodo.io",
            subs: [],
            createdAt: new Date(),
        });

        prisma.organization.create.mockRejectedValue(
            new Prisma.PrismaClientKnownRequestError(
                "Unique constraint failed on the `slug`",
                {
                    code: "P2002",
                    clientVersion: "4.9.0",
                    meta: { target: "slug" },
                }
            )
        );

        const response = await server.inject({
            method: "POST",
            url: "/orgs",
            payload: {
                name: "My Organization",
            },
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        expect(response.statusCode).toEqual(400);
        expect(response.statusMessage).toEqual("Bad Request");
        expect(response.json()).toEqual<Error>({
            statusCode: 400,
            message: "Unique constraint failed on the `slug`",
            error: "P2002",
        });
    });
});
