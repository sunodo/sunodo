import Fastify from "fastify";
import { isAddress } from "viem";
import { start, stop } from "./process.js";
import { InMemoryApplicationRepository } from "./repository.js";
import * as API from "./types.js";

export const createServer = () => {
    const manager = new InMemoryApplicationRepository();
    const fastify = Fastify({ logger: true });

    // list of application
    fastify.get<{
        Reply: API.ApplicationListResponseBody;
        Querystring: API.ApplicationListRequestQuery;
    }>("/applications", async (request, reply) => {
        const offset = request.query?.offset ?? 0;
        const limit = request.query?.limit ?? 100;
        const data = await manager.list(offset, limit, request.query?.status);
        const total_count = await manager.count(request.query?.status);
        return reply.send({ total_count, data, limit, offset });
    });

    // application item
    fastify.get<{
        Params: API.ApplicationGetItemRequestParams;
        Reply: API.ApplicationGetItemResponseBody;
    }>("/applications/:address", async (request, reply) => {
        const { address } = request.params;
        if (!isAddress(address)) {
            return reply.status(400).send({
                statusCode: 400,
                error: "Bad Request",
                message: "Invalid address format",
            });
        }
        const application = await manager.find(address);
        if (application) {
            return reply.send(application);
        } else {
            return reply.status(404).send({
                statusCode: 404,
                error: "Not Found",
                message: "Application not found",
            });
        }
    });

    fastify.put<{
        Params: API.ApplicationPutItemRequestParams;
        Body: API.ApplicationPutItemRequestBody;
        Reply: API.ApplicationPutItemResponseBody;
    }>("/applications/:address", async (request, reply) => {
        const { address } = request.params;
        const application = await manager.find(address);
        if (application) {
            if (
                application.blockNumber === request.body.blockNumber &&
                application.snapshotUri === request.body.snapshotUri &&
                application.templateHash === request.body.templateHash
            ) {
                return reply.send(application);
            } else {
                return reply.status(409).send({
                    statusCode: 409,
                    error: "Conflict",
                    message: "Application already exists",
                });
            }
        } else {
            const application = await manager.create({
                address,
                ...request.body,
                status: "starting",
            });

            // start node
            start(application);

            return reply.status(200).send(application);
        }
    });

    fastify.delete<{
        Params: API.ApplicationDeleteItemRequestParams;
        Reply: API.ApplicationDeleteItemResponseBody;
    }>("/applications/:address", async (request, reply) => {
        const { address } = request.params;
        const application = await manager.find(address);
        if (application) {
            await manager.remove(address);

            // stop node
            await stop(application);

            return reply.status(204).send();
        } else {
            return reply.status(404).send({
                statusCode: 404,
                error: "Not Found",
                message: "Application not found",
            });
        }
    });

    fastify.get("/healthz", (_request, reply) => reply.send());
    return fastify;
};
