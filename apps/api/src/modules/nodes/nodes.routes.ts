import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyTypebox } from "../../types";
import {
    createHandler,
    deleteHandler,
    getHandler,
    listHandler,
} from "./nodes.handlers";
import {
    CreateNodeSchema,
    DeleteNodeSchema,
    GetNodeSchema,
    ListNodeSchema,
} from "./nodes.schemas";

const routes: FastifyPluginAsyncTypebox = async (server: FastifyTypebox) => {
    server.post(
        "/",
        { schema: CreateNodeSchema, preValidation: server.authenticate },
        createHandler
    );

    server.get(
        "/",
        { schema: ListNodeSchema, preValidation: server.authenticate },
        listHandler
    );

    server.get(
        "/:chain",
        { schema: GetNodeSchema, preValidation: server.authenticate },
        getHandler
    );

    server.delete(
        "/:chain",
        { schema: DeleteNodeSchema, preValidation: server.authenticate },
        deleteHandler
    );
};

export default routes;
