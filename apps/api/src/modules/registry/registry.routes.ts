import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyTypebox } from "../../types";
import { tokenHandler } from "./registry.handlers";
import { TokenSchema } from "./registry.schemas";

const routes: FastifyPluginAsyncTypebox = async (server: FastifyTypebox) => {
    server.get(
        "/token",
        {
            schema: TokenSchema,
            preValidation: server.authenticate,
        },
        tokenHandler
    );
};

export default routes;
