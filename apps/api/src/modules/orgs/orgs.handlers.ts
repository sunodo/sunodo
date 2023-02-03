import { OrganizationType, Prisma, Role } from "@prisma/client";
import slugify from "slugify";

import { RouteHandlerMethodTypebox } from "../../types";
import prisma from "../../utils/prisma";
import { CreateOrgSchema, ListOrgSchema } from "./orgs.schemas";

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
                type: OrganizationType.SHARED,
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

export const listHandler: RouteHandlerMethodTypebox<
    typeof ListOrgSchema
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

    // list organizations of authenticated
    const organizations = await prisma.organization.findMany({
        where: {
            members: {
                some: {
                    userId: user.id,
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
