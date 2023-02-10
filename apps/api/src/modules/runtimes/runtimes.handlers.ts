import { RouteHandlerMethodTypebox } from "../../types";
import { ListRuntimesSchema } from "./runtimes.schemas";

export const listHandler: RouteHandlerMethodTypebox<
    typeof ListRuntimesSchema
> = async (request, reply) => {
    const runtimes = await request.prisma.runtime.findMany();
    return reply.code(200).send(runtimes);
};
