import { RouteHandlerMethodTypebox } from "../../types";
import { ListChainsSchema } from "./chains.schemas";

export const listHandler: RouteHandlerMethodTypebox<
    typeof ListChainsSchema
> = async (request, reply) => {
    const chains = await request.prisma.chain.findMany();
    return reply.code(200).send(chains);
};
