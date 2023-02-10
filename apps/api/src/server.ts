import Fastify from "fastify";
import jwt from "fastify-auth0-verify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import {
    TypeBoxTypeProvider,
    TypeBoxValidatorCompiler,
} from "@fastify/type-provider-typebox";
import { PrismaClient } from "@prisma/client";

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

export interface ServerOptions {
    prisma: PrismaClient;
    logger: boolean;
}

const buildServer = (options: ServerOptions): FastifyTypebox => {
    const server: FastifyTypebox = Fastify({
        logger: options.logger,
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

    // make PrismaClient available through the fastify server instance and server request
    server
        .decorate<PrismaClient>("prisma", options.prisma)
        .addHook("onRequest", async (request, reply) => {
            request.prisma = options.prisma;
        })
        .addHook("onClose", async (server: FastifyTypebox) => {
            // disconnect here
            await server.prisma?.$disconnect();
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
            components: {
                securitySchemes: {
                    openId: {
                        type: "openIdConnect",
                        openIdConnectUrl: `${issuer}.well-known/openid-configuration`,
                    },
                },
            },
        },
    });
    server.register(swaggerUi, {
        routePrefix: "/docs",
        uiConfig: {
            deepLinking: false,
        },
        initOAuth: {
            clientId: process.env.AUTH_OPEN_API_CLIENT_ID,
            scopes: ["email", "openid", "profile"],
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
