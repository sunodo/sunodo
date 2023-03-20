import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyTypebox } from "../../types";
import {
    createHandler,
    deleteHandler,
    getHandler,
    listHandler,
} from "./contracts.handlers";
import {
    CreateContractSchema,
    DeleteContractSchema,
    GetContractSchema,
    ListContractSchema,
} from "./contracts.schemas";

const routes: FastifyPluginAsyncTypebox = async (server: FastifyTypebox) => {
    server.post(
        "/",
        { schema: CreateContractSchema, preValidation: server.authenticate },
        createHandler
    );

    server.get(
        "/",
        { schema: ListContractSchema, preValidation: server.authenticate },
        listHandler
    );

    server.get(
        "/:id",
        { schema: GetContractSchema, preValidation: server.authenticate },
        getHandler
    );

    server.delete(
        "/:id",
        { schema: DeleteContractSchema, preValidation: server.authenticate },
        deleteHandler
    );
};

export default routes;
