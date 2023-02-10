import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyTypebox } from "../../types";
import { createHandler, getHandler, listHandler } from "./apps.handlers";
import { CreateAppSchema, GetAppSchema, ListAppSchema } from "./apps.schemas";
import deploymentsRoutes from "../deployments/deployments.routes";

const routes: FastifyPluginAsyncTypebox = async (server: FastifyTypebox) => {
    server.post(
        "/",
        {
            schema: CreateAppSchema,
            preValidation: server.authenticate,
        },
        createHandler
    );

    server.get(
        "/",
        {
            schema: ListAppSchema,
            preValidation: server.authenticate,
        },
        listHandler
    );

    server.get(
        "/:name",
        {
            schema: GetAppSchema,
            preValidation: server.authenticate,
        },
        getHandler
    );

    server.register(deploymentsRoutes, {
        prefix: "/:app/deployments",
    });
};

export default routes;
