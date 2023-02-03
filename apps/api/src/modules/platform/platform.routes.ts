import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyTypebox } from "../../types";
import {
    listChainsHandler,
    listRegionsHandler,
    listRuntimesHandler,
} from "./platform.handlers";
import {
    ListChainsSchema,
    ListRegionsSchema,
    ListRuntimesSchema,
} from "./platform.schemas";

const routes: FastifyPluginAsyncTypebox = async (server: FastifyTypebox) => {
    server.get(
        "/chains",
        {
            schema: ListChainsSchema,
        },
        listChainsHandler
    );

    server.get(
        "/regions",
        {
            schema: ListRegionsSchema,
        },
        listRegionsHandler
    );

    server.get(
        "/runtimes",
        {
            schema: ListRuntimesSchema,
        },
        listRuntimesHandler
    );
};

export default routes;
