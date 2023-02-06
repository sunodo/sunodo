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
import chainsRoutes from "./modules/chains/chains.routes";
import orgsRoutes from "./modules/orgs/orgs.routes";
import regionsRoutes from "./modules/regions/regions.routes";
import runtimesRoutes from "./modules/runtimes/runtimes.routes";
import { FastifyTypebox } from "./types";

const issuer = process.env.AUTH_ISSUER;

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
            deepLinking: false,
        },
    });

    // register application routes
    server.register(appsRoutes, { prefix: "apps" });
    server.register(authRoutes, { prefix: "auth" });
    server.register(chainsRoutes, { prefix: "chains" });
    server.register(orgsRoutes, { prefix: "orgs" });
    server.register(regionsRoutes, { prefix: "regions" });
    server.register(runtimesRoutes, { prefix: "runtimes" });

    return server;
};

export default buildServer;
