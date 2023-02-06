import { RouteHandlerMethodTypebox } from "../../types";
import prisma from "../../utils/prisma";
import { ListRuntimesSchema } from "./runtimes.schemas";

export const listHandler: RouteHandlerMethodTypebox<
    typeof ListRuntimesSchema
> = async (_request, reply) => {
    const runtimes = await prisma.runtime.findMany();
    return reply.code(200).send(runtimes);
};
