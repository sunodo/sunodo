import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import middyJsonBodyParser from "@middy/http-json-body-parser";

import { authHandler, AuthorizedHandler, ITokenPayload } from "@libs/auth";
import { Organization, PrismaClient } from "../../../generated/client";

import {
    uniqueNamesGenerator,
    adjectives,
    animals,
    NumberDictionary,
    Config,
} from "unique-names-generator";

import schema from "./schema";

const prisma = new PrismaClient();

/**
 * Name generator, generate names like `lazy-pig-345`
 */
const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
const nameGeneratorConfig: Config = {
    dictionaries: [adjectives, animals, numberDictionary],
    separator: "-",
};

const loadOrganization = async (
    token: ITokenPayload,
    org?: string
): Promise<Organization> => {
    // load user
    const user = await prisma.user.findUnique({
        where: {
            email: "",
        },
    });

    if (org) {
        // get the organization by slug
        // user must be a member
        const organization = prisma.organization.findUnique({
            where: {
                slug: org,
            },
            include: {
                members: {
                    where: {
                        userId: user.id,
                    },
                },
            },
        });
        return organization;
    } else {
        // attach to personal organization
        const organization = prisma.organization.findUnique({
            where: {
                id: user.id,
            },
        });
        return organization;
    }
};

const createApp: AuthorizedHandler<typeof schema> = async (event) => {
    // generate a name of not specified
    const name = event.body.name || uniqueNamesGenerator(nameGeneratorConfig);

    // load organization
    const organization = await loadOrganization(
        event.auth.payload,
        event.body.org
    );
    // XXX: do we need to validate if name not exists? Or let prisma explodes?

    const application = await prisma.application.create({
        data: {
            name,
            organizationId: organization.id,
        },
    });

    return {
        statusCode: 201,
        body: JSON.stringify({ id: application.id, name: application.name }),
    };
};

export const main = middy(createApp)
    .use(middyJsonBodyParser())
    .use(httpHeaderNormalizer())
    .use(httpErrorHandler())
    .use(authHandler());
