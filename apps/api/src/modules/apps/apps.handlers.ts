import { Prisma, Account } from "@prisma/client";
import {
    uniqueNamesGenerator,
    adjectives,
    animals,
    NumberDictionary,
    Config,
} from "unique-names-generator";

import {
    CreateAppSchema,
    DeleteAppSchema,
    GetAppSchema,
    ListAppSchema,
} from "./apps.schemas";
import { RouteHandlerMethodTypebox } from "../../types";

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
            data: { name, accountId: account.id },
        });

        return reply.code(201).send({ name: app.name });
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

export const deleteHandler: RouteHandlerMethodTypebox<
    typeof DeleteAppSchema
> = async (request, reply) => {
    try {
        // either app belong to user account or to organization account where user is a member, use an OR
        const account: Prisma.AccountWhereInput = {
            OR: [
                { user: { subs: { has: request.user.sub } } },
                {
                    organization: {
                        members: {
                            some: { user: { subs: { has: request.user.sub } } },
                        },
                    },
                },
            ],
        };
        const deleted = await request.prisma.application.deleteMany({
            where: {
                name: request.params.name,
                account,
            },
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
                    message: "Cannot delete application that has related data",
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

    return dapp ? reply.code(200).send(dapp) : reply.code(404).send();
};
