import { Prisma } from "@prisma/client";
import {
    uniqueNamesGenerator,
    adjectives,
    animals,
    NumberDictionary,
    Config,
} from "unique-names-generator";

import { RouteHandlerMethodTypebox } from "../../types";
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
    const user = await request.prisma.user.findFirst({
        where: {
            subs: {
                has: request.user.sub,
            },
        },
    });

    // logged in user
    if (!user) {
        return reply.code(401).send();
    }

    // name of application
    const name = request.body.name ?? uniqueNamesGenerator(nameGeneratorConfig);
    // XXX: validate with pattern /^[a-z][a-z0-9-]{1,28}[a-z0-9]$/

    const account = await request.prisma.account.findFirst({
        where: request.body.org
            ? {
                  organization: {
                      slug: request.body.org,
                      members: {
                          some: {
                              user: { subs: { has: request.user.sub } },
                          },
                      },
                  },
              }
            : { user: { subs: { has: request.user.sub } } },
    });

    if (account === null) {
        return reply.code(400).send({
            statusCode: 400,
            error: "Error",
            message: `Invalid organization '${request.body.org}'`,
        });
    }

    try {
        // create application, connected to account
        const app = await request.prisma.application.create({
            data: {
                name,
                accountId: account.id,
            },
        });

        return reply.code(200).send({
            name: app.name,
        });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                const fields = e.meta?.target as string[];
                const message = `Application with same ${fields
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

export const listHandler: RouteHandlerMethodTypebox<
    typeof ListAppSchema
> = async (request, reply) => {
    // if org is defined, search for applications owned by organization account
    // otherwise search for applications owned by user account
    const apps = await request.prisma.application.findMany({
        where: {
            account: request.query.org
                ? {
                      organization: {
                          slug: request.query.org,
                          members: {
                              some: {
                                  user: { subs: { has: request.user.sub } },
                              },
                          },
                      },
                  }
                : { user: { subs: { has: request.user.sub } } },
        },
    });
    return reply.code(200).send(apps);
};

export const getHandler: RouteHandlerMethodTypebox<
    typeof GetAppSchema
> = async (request, reply) => {
    // search by name of application
    // also must belong to user account or organization account where user is a member
    const dapp = await request.prisma.application.findFirst({
        where: {
            name: request.params.name,
            account: {
                OR: [
                    { user: { subs: { has: request.user.sub } } },
                    {
                        organization: {
                            members: {
                                some: {
                                    user: { subs: { has: request.user.sub } },
                                },
                            },
                        },
                    },
                ],
            },
        },
    });

    if (!dapp) {
        return reply.code(404);
    }
    return reply.code(200).send(dapp);
};
