import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyTypebox } from "../../types";
import {
    createHandler,
    deleteHandler,
    getHandler,
    listHandler,
} from "./deployments.handlers";
import {
    CreateDeploymentSchema,
    DeleteDeploymentSchema,
    GetDeploymentSchema,
    ListDeploymentSchema,
} from "./deployments.schemas";

const routes: FastifyPluginAsyncTypebox = async (server: FastifyTypebox) => {
    server.post(
        "/",
        { schema: CreateDeploymentSchema, preValidation: server.authenticate },
        createHandler
    );

    server.get(
        "/",
        { schema: ListDeploymentSchema, preValidation: server.authenticate },
        listHandler
    );

    server.get(
        "/:id",
        { schema: GetDeploymentSchema, preValidation: server.authenticate },
        getHandler
    );

    server.delete(
        "/:id",
        { schema: DeleteDeploymentSchema, preValidation: server.authenticate },
        deleteHandler
    );
};

export default routes;
