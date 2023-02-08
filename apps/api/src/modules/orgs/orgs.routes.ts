import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyTypebox } from "../../types";
import {
    createHandler,
    deleteHandler,
    getHandler,
    listHandler,
} from "./orgs.handlers";
import {
    CreateOrgSchema,
    DeleteOrgSchema,
    GetOrgSchema,
    ListOrgSchema,
} from "./orgs.schemas";

const routes: FastifyPluginAsyncTypebox = async (server: FastifyTypebox) => {
    server.post(
        "/",
        {
            schema: CreateOrgSchema,
            preValidation: server.authenticate,
        },
        createHandler
    );

    server.get(
        "/",
        {
            schema: ListOrgSchema,
            preValidation: server.authenticate,
        },
        listHandler
    );

    server.get(
        "/:slug",
        {
            schema: GetOrgSchema,
            preValidation: server.authenticate,
        },
        getHandler
    );

    server.delete(
        "/:slug",
        {
            schema: DeleteOrgSchema,
            preValidation: server.authenticate,
        },
        deleteHandler
    );
};

export default routes;
