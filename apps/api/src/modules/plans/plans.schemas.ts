import { Type } from "@sinclair/typebox";

const PlanSchema = Type.Object({
    id: Type.String(),
    name: Type.String(),
    label: Type.String(),
});

export const ListPlansSchema = {
    summary: "List available plans",
    response: {
        200: Type.Array(PlanSchema),
    },
};
