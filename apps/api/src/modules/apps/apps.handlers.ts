import {
    uniqueNamesGenerator,
    adjectives,
    animals,
    NumberDictionary,
    Config,
} from "unique-names-generator";

import { RouteHandlerMethodTypebox } from "../../types";
import prisma from "../../utils/prisma";
import { CreateAppSchema, GetAppSchema, ListAppSchema } from "./apps.schemas";

/**
 * Name generator, generate names like `lazy-pig-345`
 */
const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
const nameGeneratorConfig: Config = {
    dictionaries: [adjectives, animals, numberDictionary],
    separator: "-",
};

export const createHandler: RouteHandlerMethodTypebox<
    typeof CreateAppSchema
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

    // name of application
    const name = request.body.name ?? uniqueNamesGenerator(nameGeneratorConfig);

    // XXX: validate with pattern /^[a-z][a-z0-9-]{1,28}[a-z0-9]$/

    // find organization by slug (user must be member), or use user personal organization
    const organization = request.body.org
        ? await prisma.organization.findFirst({
              where: {
                  slug: request.body.org,
                  members: {
                      some: {
                          userId: user.id,
                      },
                  },
              },
          })
        : await prisma.organization.findUnique({
              where: {
                  id: user.id,
              },
          });
    if (!organization) {
        return reply.code(400).send({
            statusCode: 400,
            error: "Error",
            message: `Invalid organization '${name}'`,
        });
    }

    // create application, connected to organization
    const app = await prisma.application.create({
        data: {
            name,
            organization: {
                connect: {
                    id: organization.id,
                },
            },
        },
    });

    return reply.code(200).send({
        name: app.name,
    });
};

export const listHandler: RouteHandlerMethodTypebox<
    typeof ListAppSchema
> = async (request, reply) => {
    // get authenticated user
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

    const org = request.query.org
        ? await prisma.organization.findUnique({
              where: {
                  slug: request.query.org,
                  // XXX: check if user is member
              },
              include: {
                  applications: true,
              },
          })
        : await prisma.organization.findUnique({
              where: {
                  id: user.id,
              },
              include: {
                  applications: true,
              },
          });

    const apps = org ? org.applications : [];
    return reply.code(200).send(apps);
};

export const getHandler: RouteHandlerMethodTypebox<
    typeof GetAppSchema
> = async (request, reply) => {
    // get authenticated user
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

    // search by name of application, where user must be member of application organization
    const dapp = await prisma.application.findUnique({
        where: {
            name: request.params.name,
        },
        include: {
            organization: {
                include: {
                    members: {
                        where: {
                            userId: user.id,
                        },
                    },
                },
            },
        },
    });

    if (!dapp) {
        return reply.code(404);
    }

    // XXX: check authorization (user must be organization member)

    return reply.code(200).send({
        name: dapp.name,
    });
};
