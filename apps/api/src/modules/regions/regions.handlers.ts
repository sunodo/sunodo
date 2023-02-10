import { RouteHandlerMethodTypebox } from "../../types";
import { ListRegionsSchema } from "./regions.schemas";

export const listHandler: RouteHandlerMethodTypebox<
    typeof ListRegionsSchema
> = async (request, reply) => {
    const regions = await request.prisma.region.findMany();
    return reply.code(200).send(regions);
};
