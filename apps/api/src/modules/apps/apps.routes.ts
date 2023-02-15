import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyTypebox } from "../../types";
import {
    createHandler,
    deleteHandler,
    getHandler,
    listHandler,
} from "./apps.handlers";
import {
    CreateAppSchema,
    DeleteAppSchema,
    GetAppSchema,
    ListAppSchema,
} from "./apps.schemas";
import deploymentsRoutes from "../deployments/deployments.routes";

const routes: FastifyPluginAsyncTypebox = async (server: FastifyTypebox) => {
    server.post(
        "/",
        { schema: CreateAppSchema, preValidation: server.authenticate },
        createHandler
    );

    server.get(
        "/",
        { schema: ListAppSchema, preValidation: server.authenticate },
        listHandler
    );

    server.get(
        "/:name",
        { schema: GetAppSchema, preValidation: server.authenticate },
        getHandler
    );

    server.delete(
        "/:name",
        { schema: DeleteAppSchema, preValidation: server.authenticate },
        deleteHandler
    );

    server.register(deploymentsRoutes, { prefix: "/:app/deployments" });
};

export default routes;
