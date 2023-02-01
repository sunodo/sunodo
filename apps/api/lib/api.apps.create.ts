import middy from "@middy/core";
import validator from "@middy/validator";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import userLoader from "./userLoader";
import {
    uniqueNamesGenerator,
    adjectives,
    animals,
    NumberDictionary,
    Config,
} from "unique-names-generator";

import prisma from "./prisma";
import { ValidatedHandler } from "./validation";

// schema of the request body
const requestSchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        org: { type: "string" },
    },
} as const;

// schema of the response body
const responseSchema = {
    type: "object",
    properties: {
        name: { type: "string" },
    },
} as const;

/**
 * Name generator, generate names like `lazy-pig-345`
 */
const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
const nameGeneratorConfig: Config = {
    dictionaries: [adjectives, animals, numberDictionary],
    separator: "-",
};

export const baseHandler: ValidatedHandler<
    typeof requestSchema,
    typeof responseSchema
> = async (event) => {
    // get name from event, or create a random one
    const name = event.body.name ?? uniqueNamesGenerator(nameGeneratorConfig);

    // logged in user
    const user = event.requestContext.user;
    if (!user) {
        return {
            statusCode: 401,
        };
    }

    // find organization by slug (user must be member), or use user personal organization
    const organization = event.body.org
        ? await prisma.organization.findFirst({
              where: {
                  slug: event.body.org,
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
        return {
            statusCode: 400,
            body: JSON.stringify({ message: `Invalid organization ${name}` }),
        };
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

    return {
        statusCode: 200,
        body: JSON.stringify(app),
    };
};

export const handler = middy(baseHandler)
    .use(httpHeaderNormalizer())
    .use(httpJsonBodyParser())
    .use(
        validator({
            eventSchema: requestSchema,
        })
    )
    .use(
        userLoader({
            prisma,
        })
    );
