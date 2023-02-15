import { Prisma } from "@prisma/client";
import { RouteHandlerMethodTypebox } from "../../types";
import {
    CreateInviteSchema,
    DeleteInviteSchema,
    GetInviteSchema,
    ListInviteSchema,
} from "./invites.schemas";

export const createHandler: RouteHandlerMethodTypebox<
    typeof CreateInviteSchema
> = async (request, reply) => {
    try {
        const organization = await request.prisma.organization.findFirst({
            where: {
                slug: request.params.slug,
                members: {
                    some: { user: { subs: { has: request.user.sub } } },
                },
            },
        });
        if (!organization) {
            return reply.code(404).send();
        }

        // create invite
        const invite = await request.prisma.organizationInvite.create({
            data: {
                email: request.body.email,
                organization: { connect: { id: organization.id } },
            },
        });

        // XXX: send invitation email
        return reply.code(200).send(invite);
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

export const listHandler: RouteHandlerMethodTypebox<
    typeof ListInviteSchema
> = async (request, reply) => {
    const invites = await request.prisma.organizationInvite.findMany({
        where: {
            organization: {
                slug: request.params.slug,
                members: {
                    some: { user: { subs: { has: request.user.sub } } },
                },
            },
        },
    });

    return reply.code(200).send(invites);
};

export const getHandler: RouteHandlerMethodTypebox<
    typeof GetInviteSchema
> = async (request, reply) => {
    // filter of logged on user
    const organization: Prisma.OrganizationWhereInput = {
        slug: request.params.slug,
        members: { some: { user: { subs: { has: request.user.sub } } } },
    };

    const invite = await request.prisma.organizationInvite.findFirst({
        where: { email: request.params.slug, organization },
    });

    return invite ? reply.code(200).send(invite) : reply.code(404).send();
};

export const deleteHandler: RouteHandlerMethodTypebox<
    typeof DeleteInviteSchema
> = async (request, reply) => {
    // filter of logged on user
    const organization: Prisma.OrganizationWhereInput = {
        slug: request.params.slug,
        members: { some: { user: { subs: { has: request.user.sub } } } },
    };

    try {
        const deleted = await request.prisma.organizationInvite.deleteMany({
            where: { email: request.params.email, organization },
        });
        return deleted.count > 0
            ? reply.code(204).send()
            : reply.code(404).send();
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code == "P2003") {
                return reply.code(400).send({
                    statusCode: 400,
                    error: "Bad input",
                    message: "Cannot delete invite that has related data",
                });
            }
            return reply.code(400).send({
                statusCode: 400,
                error: e.code,
                message: e.message,
            });
        } else {
            return reply.code(500).send({
                statusCode: 400,
                message: "Unknown error",
            });
        }
    }
};
