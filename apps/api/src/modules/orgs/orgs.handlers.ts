import { Prisma, Role } from "@prisma/client";
import slugify from "slugify";

import { RouteHandlerMethodTypebox } from "../../types";
import prisma from "../../utils/prisma";
import {
    CreateOrgSchema,
    DeleteOrgSchema,
    GetOrgSchema,
    ListOrgSchema,
} from "./orgs.schemas";

export const createHandler: RouteHandlerMethodTypebox<
    typeof CreateOrgSchema
> = async (request, reply) => {
    const user = await prisma.user.findFirst({
        where: {
            subs: {
                has: request.user.sub,
            },
        },
    });

    // logged in user
    if (!user) {
        return reply.code(401);
    }

    // slug of organization, use one provided, or create one from the name
    const name = request.body.name;
    const slug = request.body.slug ?? slugify(name, { lower: true });

    // create organization with authenticated user as administrator
    try {
        const organization = await prisma.organization.create({
            data: {
                name,
                slug,
                members: {
                    create: {
                        userId: user.id,
                        role: Role.ADMIN,
                    },
                },
            },
        });

        return reply.code(201).send({
            name: organization.name,
            slug: organization.slug!,
        });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                return reply.code(400).send({
                    statusCode: 400,
                    error: e.code,
                    message: e.message,
                });
            }
        }
    }
};

export const getHandler: RouteHandlerMethodTypebox<
    typeof GetOrgSchema
> = async (request, reply) => {
    // list organizations of authenticated
    const om = await prisma.organizationMember.findFirst({
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
        return reply.code(404);
    }

    return reply.code(200).send(om.organization);
};

export const deleteHandler: RouteHandlerMethodTypebox<
    typeof DeleteOrgSchema
> = async (request, reply) => {
    // find the organization
    const om = await prisma.organizationMember.findFirst({
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
        return reply.code(404);
    }

    // delete invites, members and the org itself
    const deleteInvites = prisma.organizationInvite.deleteMany({
        where: {
            organizationId: om.organizationId,
        },
    });
    const deleteMembers = prisma.organizationMember.deleteMany({
        where: {
            organizationId: om.organizationId,
        },
    });
    const deleteOrg = prisma.organization.delete({
        where: {
            id: om.organizationId,
        },
    });
    await prisma.$transaction([deleteInvites, deleteMembers, deleteOrg]);
    return reply.code(204);
};

export const listHandler: RouteHandlerMethodTypebox<
    typeof ListOrgSchema
> = async (request, reply) => {
    // list organizations of authenticated
    const organizations = await prisma.organization.findMany({
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
