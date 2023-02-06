import { RouteHandlerMethodTypebox } from "../../types";
import prisma from "../../utils/prisma";
import { ListRegionsSchema } from "./regions.schemas";

export const listHandler: RouteHandlerMethodTypebox<
    typeof ListRegionsSchema
> = async (_request, reply) => {
    const regions = await prisma.region.findMany();
    return reply.code(200).send(regions);
};
