import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { AccountType, PrismaClient } from "@prisma/client";

import { Error } from "../../../src/schemas";
import { token } from "../../auth";
import buildServer from "../../utils/server";
import { FastifyContext } from "../../types";
import { TokenResponse } from "../../../src/modules/registry/registry.schemas";
import { createDecoder, createVerifier } from "fast-jwt";
import { readFileSync } from "fs";
import { createTestApplication } from "../../utils/application";
import { createTestUser } from "../../utils/user";
import { createTestOrganization } from "../../utils/organization";

const verifier = createVerifier({
    key: readFileSync("keys/registry.public.key", "utf8"),
});
const decoder = createDecoder();

describe("registry:token", () => {
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

    test<FastifyContext>("no authentication", async (ctx) => {
        const app = "my-app";
        const response = await ctx.server.inject({
            method: "GET",
            url: "/registry/token",
            query: {
                client_id: "123",
                offline_token: "false",
                service: "registry",
                scope: `repository:${app}:pull,push`,
            },
            payload: {},
        });
        expect(response.statusCode).toEqual(401);
        expect(response.statusMessage).toEqual("Unauthorized");
        expect(response.json()).toEqual<Error>({
            statusCode: 401,
            error: "Unauthorized",
            message: "Missing Authorization HTTP header.",
        });
    });

    test<FastifyContext>("no applications", async (ctx) => {
        const app = "my-app";
        const response = await ctx.server.inject({
            method: "GET",
            url: "/registry/token",
            query: {
                client_id: "123",
                offline_token: "false",
                service: "registry",
                scope: `repository:${app}:pull,push`,
            },
            payload: {},
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        expect(response.statusCode).toEqual(200);
        const { token: jwtStr } = response.json() as TokenResponse;

        // verify token validity using public key
        verifier(jwtStr);
        const jwt = decoder(jwtStr);
        expect(jwt.sub).toEqual("1234567890");
        expect(jwt.access).toHaveLength(0);
    });

    test<FastifyContext>("not my application", async (ctx) => {
        const apps = ["app-3", "app-5"];
        const response = await ctx.server.inject({
            method: "GET",
            url: "/registry/token",
            query: {
                client_id: "123",
                offline_token: "false",
                service: "registry",
                scope: apps
                    .map((app) => `repository:${app}:pull,push`)
                    .join(" "),
            },
            payload: {},
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        expect(response.statusCode).toEqual(200);
        const { token: jwtStr } = response.json() as TokenResponse;

        // verify token validity using public key
        verifier(jwtStr);
        const jwt = decoder(jwtStr);
        expect(jwt.sub).toEqual("1234567890");
        expect(jwt.access).toHaveLength(0);
    });

    test<FastifyContext>("partial response", async (ctx) => {
        const apps = ["app-1", "app-5"];
        const response = await ctx.server.inject({
            method: "GET",
            url: "/registry/token",
            query: {
                client_id: "123",
                offline_token: "false",
                service: "registry",
                scope: apps
                    .map((app) => `repository:${app}:pull,push`)
                    .join(" "),
            },
            payload: {},
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        expect(response.statusCode).toEqual(200);
        const { token: jwtStr } = response.json() as TokenResponse;

        // verify token validity using public key
        verifier(jwtStr);
        const jwt = decoder(jwtStr);
        expect(jwt.sub).toEqual("1234567890");
        expect(jwt.access).toHaveLength(1);
        expect(jwt.access[0]).toEqual({
            type: "repository",
            name: "app-1",
            actions: ["pull", "push"],
        });
    });

    test<FastifyContext>("success", async (ctx) => {
        const apps = ["app-1", "app-4"];
        const response = await ctx.server.inject({
            method: "GET",
            url: "/registry/token",
            query: {
                client_id: "123",
                offline_token: "false",
                service: "registry",
                scope: apps
                    .map((app) => `repository:${app}:pull,push`)
                    .join(" "),
            },
            payload: {},
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        expect(response.statusCode).toEqual(200);
        const { token: jwtStr } = response.json() as TokenResponse;

        // verify token validity using public key
        verifier(jwtStr);
        const jwt = decoder(jwtStr);
        expect(jwt.sub).toEqual("1234567890");
        expect(jwt.access).toHaveLength(2);
        expect(jwt.access[0]).toEqual({
            type: "repository",
            name: "app-1",
            actions: ["pull", "push"],
        });
        expect(jwt.access[1]).toEqual({
            type: "repository",
            name: "app-4",
            actions: ["pull", "push"],
        });
    });
});
