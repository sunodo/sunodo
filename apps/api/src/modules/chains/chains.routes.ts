import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyTypebox } from "../../types";
import { listHandler } from "./chains.handlers";
import { ListChainsSchema } from "./chains.schemas";

const routes: FastifyPluginAsyncTypebox = async (server: FastifyTypebox) => {
    server.get(
        "/",
        {
            schema: ListChainsSchema,
        },
        listHandler
    );
};

export default routes;
