import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyTypebox } from "../../types";
import {
    createHandler,
    deleteHandler,
    getHandler,
    listHandler,
} from "./invites.handlers";
import {
    CreateInviteSchema,
    DeleteInviteSchema,
    GetInviteSchema,
    ListInviteSchema,
} from "./invites.schemas";

const routes: FastifyPluginAsyncTypebox = async (server: FastifyTypebox) => {
    server.post(
        "/",
        { schema: CreateInviteSchema, preValidation: server.authenticate },
        createHandler
    );

    server.get(
        "/",
        { schema: ListInviteSchema, preValidation: server.authenticate },
        listHandler
    );

    server.get(
        "/:email",
        { schema: GetInviteSchema, preValidation: server.authenticate },
        getHandler
    );

    server.delete(
        "/:email",
        { schema: DeleteInviteSchema, preValidation: server.authenticate },
        deleteHandler
    );
};

export default routes;
