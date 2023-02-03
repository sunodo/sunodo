import { RouteHandlerMethodTypebox } from "../../types";
import prisma from "../../utils/prisma";
import {
    ListChainsSchema,
    ListRegionsSchema,
    ListRuntimesSchema,
} from "./platform.schemas";

export const listChainsHandler: RouteHandlerMethodTypebox<
    typeof ListChainsSchema
> = async (_request, reply) => {
    const chains = await prisma.chain.findMany();
    return reply.code(200).send(chains);
};

export const listRegionsHandler: RouteHandlerMethodTypebox<
    typeof ListRegionsSchema
> = async (_request, reply) => {
    const regions = await prisma.region.findMany();
    return reply.code(200).send(regions);
};

export const listRuntimesHandler: RouteHandlerMethodTypebox<
    typeof ListRuntimesSchema
> = async (_request, reply) => {
    const runtimes = await prisma.runtime.findMany();
    return reply.code(200).send(runtimes);
};
