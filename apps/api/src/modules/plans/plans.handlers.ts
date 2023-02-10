import { RouteHandlerMethodTypebox } from "../../types";
import { ListPlansSchema } from "./plans.schemas";

export const listHandler: RouteHandlerMethodTypebox<
    typeof ListPlansSchema
> = async (request, reply) => {
    const plans = await request.prisma.plan.findMany();
    return reply.code(200).send(plans);
};
