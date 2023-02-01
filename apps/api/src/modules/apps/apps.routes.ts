import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyTypebox } from "../../types";
import { createHandler } from "./apps.handlers";
import { CreateAppSchema } from "./apps.schemas";

const routes: FastifyPluginAsyncTypebox = async (server: FastifyTypebox) => {
    server.post(
        "/",
        {
            schema: CreateAppSchema,
            preValidation: server.authenticate,
        },
        createHandler
    );
};

export default routes;
