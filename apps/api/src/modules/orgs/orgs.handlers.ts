import { AccountType, Prisma, Role } from "@prisma/client";
import { randomUUID } from "crypto";
import slugify from "slugify";

import { RouteHandlerMethodTypebox } from "../../types";
import {
    CreateOrgSchema,
    DeleteOrgSchema,
    GetOrgSchema,
    ListOrgSchema,
} from "./orgs.schemas";

export const createHandler: RouteHandlerMethodTypebox<
    typeof CreateOrgSchema
> = async (request, reply) => {
    const user = await request.prisma.user.findFirst({
        where: {
            subs: {
                has: request.user.sub,
            },
        },
    });

    // logged in user
    if (user === null) {
        return reply.code(401).send();
    }

    // slug of organization, use one provided, or create one from the name
    const name = request.body.name;
    const slug = request.body.slug ?? slugify(name, { lower: true });

    // create organization with authenticated user as administrator
    try {
        // get default plan of organizations
        const plan = await request.prisma.plan.findFirstOrThrow({
            where: {
                accountTypes: { has: AccountType.ORGANIZATION },
                default: true,
            },
        });

        // explicit id
        const id = randomUUID();

        // create stripe customer
        const customerId = await request.server.billing.createCustomer({
            name,
            description: name,
            metadata: { external_id: id },
        });

        // create organization, and account connected to default plan
        const organization = await request.prisma.organization.create({
            data: {
                id,
                name,
                slug,
                members: { create: { userId: user.id, role: Role.ADMIN } },
                account: {
                    create: {
                        id,
                        type: AccountType.ORGANIZATION,
                        plan: { connect: { id: plan.id } },
                    },
                },
                billingCustomerId: customerId,
            },
        });

        return reply.code(201).send({
            name: organization.name,
            slug: organization.slug!,
        });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                const fields = e.meta?.target as string[];
                const message = `Organization with same ${fields
                    .map((f) => `'${f}'`)
                    .join(" and ")} already exists`;
                return reply.code(400).send({
                    statusCode: 400,
                    error: e.code,
                    message: message,
                });
            }
        }
    }
};

export const getHandler: RouteHandlerMethodTypebox<
    typeof GetOrgSchema
> = async (request, reply) => {
    // list organizations of authenticated
    const om = await request.prisma.organizationMember.findFirst({
        where: {
            organization: {
                slug: request.params.slug,
            },
            user: {
                subs: {
                    has: request.user.sub,
                },
            },
        },
        include: {
            organization: true,
        },
    });

    /*
    const org = await prisma.organization.findFirst({
        where: {
            members: {
                some: {
                    user: {
                        subs: {
                            has: request.user.sub,
                        },
                    },
                },
            },
        },
    });*/

    if (!om) {
        return reply.code(404).send();
    }

    return reply.code(200).send(om.organization);
};

export const deleteHandler: RouteHandlerMethodTypebox<
    typeof DeleteOrgSchema
> = async (request, reply) => {
    // find the organization
    const om = await request.prisma.organizationMember.findFirst({
        where: {
            organization: {
                slug: request.params.slug,
            },
            user: {
                subs: {
                    has: request.user.sub,
                },
            },
        },
        include: {
            organization: true,
        },
    });
    if (!om) {
        return reply.code(404).send();
    }

    // delete invites, members and the org itself
    const deleteInvites = request.prisma.organizationInvite.deleteMany({
        where: {
            organizationId: om.organizationId,
        },
    });
    const deleteMembers = request.prisma.organizationMember.deleteMany({
        where: {
            organizationId: om.organizationId,
        },
    });
    const deleteOrg = request.prisma.organization.delete({
        where: {
            id: om.organizationId,
        },
    });
    await request.prisma.$transaction([
        deleteInvites,
        deleteMembers,
        deleteOrg,
    ]);
    return reply.code(204).send();
};

export const listHandler: RouteHandlerMethodTypebox<
    typeof ListOrgSchema
> = async (request, reply) => {
    // list organizations of authenticated
    const organizations = await request.prisma.organization.findMany({
        where: {
            members: {
                some: {
                    user: {
                        subs: {
                            has: request.user.sub,
                        },
                    },
                },
            },
        },
    });

    return reply.code(200).send(
        organizations.map((o) => ({
            name: o.name,
            slug: o.slug!,
        }))
    );
};
