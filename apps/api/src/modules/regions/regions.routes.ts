import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyTypebox } from "../../types";
import { listHandler } from "./regions.handlers";
import { ListRegionsSchema } from "./regions.schemas";

const routes: FastifyPluginAsyncTypebox = async (server: FastifyTypebox) => {
    server.get(
        "/",
        {
            schema: ListRegionsSchema,
        },
        listHandler
    );
};

export default routes;
