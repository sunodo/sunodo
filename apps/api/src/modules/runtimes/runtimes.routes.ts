import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyTypebox } from "../../types";
import { listHandler } from "./runtimes.handlers";
import { ListRuntimesSchema } from "./runtimes.schemas";

const routes: FastifyPluginAsyncTypebox = async (server: FastifyTypebox) => {
    server.get(
        "/",
        {
            schema: ListRuntimesSchema,
        },
        listHandler
    );
};

export default routes;
