import { RouteHandlerMethodTypebox } from "../../types";
import prisma from "../../utils/prisma";
import { ListChainsSchema } from "./chains.schemas";

export const listHandler: RouteHandlerMethodTypebox<
    typeof ListChainsSchema
> = async (_request, reply) => {
    const chains = await prisma.chain.findMany();
    return reply.code(200).send(chains);
};
