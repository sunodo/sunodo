import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyTypebox } from "../../types";
import { loginHandler } from "./auth.handlers";

const routes: FastifyPluginAsyncTypebox = async (server: FastifyTypebox) => {
    server.post(
        "/login",
        {
            preValidation: server.authenticate,
        },
        loginHandler
    );
};

export default routes;
