import { Application, Prisma } from "@prisma/client";
import { createSigner } from "fast-jwt";
import { readFileSync } from "fs";
const libtrust = require("libtrust");
import { RouteHandlerMethodTypebox } from "../../types";
import { TokenSchema } from "./registry.schemas";

// parse 'scope' according to docker spec at
// https://docs.docker.com/registry/spec/auth/scope/#resource-scope-grammar
const repos = (scope: string): string[] => {
    return scope
        .split(" ")
        .map((resourcescope) => {
            const [resourcetype, resourcename, action] =
                resourcescope.split(":");
            const actions = action.split(",");
            return resourcetype == "repository" ? resourcename : undefined;
        })
        .filter((r): r is string => !!r);
};

const expiration = 300; // 5 minutes expiration
const signer = createSigner({
    algorithm: "RS256",
    aud: "registry.sunodo.io",
    iss: "api.sunodo.io",
    key: readFileSync("keys/registry.private.key", "utf8"),
    kid: libtrust.fingerprint(readFileSync("keys/registry.crt", "utf8")),
    expiresIn: expiration * 1000,
});

export const tokenHandler: RouteHandlerMethodTypebox<
    typeof TokenSchema
> = async (request, reply) => {
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

    const app = async (name: string) => {
        return request.prisma.application.findFirst({
            where: { name, account },
        });
    };

    // parse repository names from scope
    const repositories: string[] = request.query.scope
        ? repos(request.query.scope)
        : [];

    // find applications with same name as repository (which user has permissions)
    const applications = (await Promise.all(repositories.map(app))).filter(
        (app): app is Application => !!app
    );

    // create access claims
    const access = applications.map(({ name }) => ({
        type: "repository",
        name,
        actions: ["pull", "push"],
    }));

    const token = signer({ sub: request.user.sub, access });
    return reply.code(200).send({ token, expires_in: expiration });
};
