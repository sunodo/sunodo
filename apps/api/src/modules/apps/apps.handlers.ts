import {
    uniqueNamesGenerator,
    adjectives,
    animals,
    NumberDictionary,
    Config,
} from "unique-names-generator";

import { RouteHandlerMethodTypebox } from "../../types";
import prisma from "../../utils/prisma";
import { CreateAppSchema } from "./apps.schemas";

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
            name: "Error",
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

    return reply.code(200).send(app);
};
