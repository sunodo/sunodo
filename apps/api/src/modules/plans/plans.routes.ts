import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyTypebox } from "../../types";
import { listHandler } from "./plans.handlers";
import { ListPlansSchema } from "./plans.schemas";

const routes: FastifyPluginAsyncTypebox = async (server: FastifyTypebox) => {
    server.get(
        "/",
        {
            schema: ListPlansSchema,
        },
        listHandler
    );
};

export default routes;
