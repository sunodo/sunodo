import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyTypebox } from "../../types";
import { createHandler } from "./deployments.handlers";
import { CreateDeploymentSchema } from "./deployments.schemas";

const routes: FastifyPluginAsyncTypebox = async (server: FastifyTypebox) => {
    server.post(
        "/",
        {
            schema: CreateDeploymentSchema,
            preValidation: server.authenticate,
        },
        createHandler
    );
};

export default routes;
