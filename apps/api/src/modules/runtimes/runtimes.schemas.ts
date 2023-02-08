import { Type } from "@sinclair/typebox";

const RuntimeSchema = Type.Object({
    name: Type.String(),
});

export const ListRuntimesSchema = {
    summary: "List supported runtimes",
    response: {
        200: Type.Array(RuntimeSchema),
    },
};
