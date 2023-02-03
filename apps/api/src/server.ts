import Fastify from "fastify";
import jwt from "fastify-auth0-verify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import {
    TypeBoxTypeProvider,
    TypeBoxValidatorCompiler,
} from "@fastify/type-provider-typebox";

import appsRoutes from "./modules/apps/apps.routes";
import authRoutes from "./modules/auth/auth.routes";
import orgsRoutes from "./modules/orgs/orgs.routes";
import { FastifyTypebox } from "./types";

const issuer = process.env.AUTH_ISSUER; // https://dev-0y8qxgon5zsrd7s1.us.auth0.com
const clientId = process.env.AUTH_CLIENT_ID; // vUR2kchV4dqerbIUP3CRuAIgurTPsrJN
const clientSecret = process.env.AUTH_CLIENT_SECRET; // 0tPrtmcPIeP3qG10kgUnB9_gmxQSifIdU7PiVAuYfZ4MGK7UebDDAnc4AGNl2-qC

declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: { id: number };
        user: {
            iss: string;
            sub: string;
            aud: string[];
            iat: number;
            exp: number;
            azp: string;
            scope: string;
        };
    }
}

const buildServer = (): FastifyTypebox => {
    const server = Fastify({
        logger: true,
        ajv: {
            customOptions: {
                allErrors: true,
            },
        },
    })
        .setValidatorCompiler(TypeBoxValidatorCompiler)
        .withTypeProvider<TypeBoxTypeProvider>();

    // healthcheck
    server.get("/healthz", async (request, response) => {
        return {
            status: "OK",
        };
    });

    // setup JWT validator using Auth0
    server.register(jwt, {
        domain: issuer,
        audience: ["https://api.sunodo.io", `${issuer}userinfo`],
    });

    // register schemas
    // server.addSchema(createSchema);

    // swagger
    server.register(swagger, {
        openapi: {
            info: {
                title: "Sunodo API",
                description: "Sunodo = Cartesi DApp management API",
                version: "v1",
            },
        },
    });
    server.register(swaggerUi, {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "full",
            deepLinking: false,
        },
    });

    // register application routes
    server.register(appsRoutes, { prefix: "apps" });
    server.register(authRoutes, { prefix: "auth" });
    server.register(orgsRoutes, { prefix: "orgs" });

    return server;
};

export default buildServer;
