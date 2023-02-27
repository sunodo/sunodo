import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { FastifyContext } from "../../types";
import buildServer from "../../utils/server";
import { createTestUser } from "../../utils/user";
import { AccountType, NodeStatus, PrismaClient } from "@prisma/client";
import { token } from "../../auth";
import { createTestApplication } from "../../utils/application";
import { createTestOrganization } from "../../utils/organization";

describe("apps:delete", () => {
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
        const app2 = await createTestApplication(prisma, {
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

        // create node for app-2
        await prisma.node.create({
            data: {
                deployment: {
                    create: {
                        contractAddress: "0x0",
                        machineSnapshot: "docker.io/my-org/my-app",
                        consensus: {
                            create: {
                                type: "AUTHORITY",
                                validators: { create: { address: "0x0" } },
                            },
                        },
                        chain: {
                            create: {
                                id: 5,
                                name: "goerli",
                                label: "Goerli",
                                enabled: true,
                                testnet: true,
                                providerUrl: "",
                            },
                        },
                    },
                },
                status: NodeStatus.READY,
                application: { connect: { id: app2.id } },
                region: {
                    create: { name: "us", default: true, kubeConfigSecret: "" },
                },
                runtime: { create: { name: "1", default: true } },
            },
        });

        beforeEach<FastifyContext>(async (ctx) => {
            ctx.plan = plan;
        });
        return async () => {
            await prisma.$transaction([
                prisma.node.deleteMany(),
                prisma.deployment.deleteMany(),
                prisma.application.deleteMany(),
                prisma.organizationMember.deleteMany(),
                prisma.organization.deleteMany(),
                prisma.user.deleteMany(),
                prisma.account.deleteMany(),
                prisma.plan.deleteMany(),
            ]);
        };
    });

    test<FastifyContext>("unauthorized", async (ctx) => {
        const response = await ctx.server.inject({
            url: "/apps/app-1",
            method: "DELETE",
        });

        expect(response.statusCode).toEqual(401);
    });

    test<FastifyContext>("unexisting app", async (ctx) => {
        const response = await ctx.server.inject({
            url: "/apps/dont-exist",
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(404);
    });

    test<FastifyContext>("not my app", async (ctx) => {
        const response = await ctx.server.inject({
            url: "/apps/app-3",
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(404);
    });

    test<FastifyContext>("not a member of org", async (ctx) => {
        const response = await ctx.server.inject({
            url: "/apps/app-5",
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(404);
    });

    test<FastifyContext>("sucess: my app", async (ctx) => {
        const response = await ctx.server.inject({
            url: "/apps/app-1",
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(204);
    });

    test<FastifyContext>("sucess: my org's app", async (ctx) => {
        const response = await ctx.server.inject({
            url: "/apps/app-4",
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(204);
    });

    test<FastifyContext>("app with deployment", async (ctx) => {
        const response = await ctx.server.inject({
            url: "/apps/app-2",
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(400);
        const error = JSON.parse(response.body) as Error;
        expect(error.message).toEqual(
            "Cannot delete application that has related data"
        );
    });
});
