import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyTypebox } from "../../types";
import { createHandler } from "./orgs.handlers";
import { CreateOrgSchema } from "./orgs.schemas";

const routes: FastifyPluginAsyncTypebox = async (server: FastifyTypebox) => {
    server.post(
        "/",
        {
            schema: CreateOrgSchema,
            preValidation: server.authenticate,
        },
        createHandler
    );
};

export default routes;
