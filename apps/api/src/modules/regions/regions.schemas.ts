import { Type } from "@sinclair/typebox";

const RegionSchema = Type.Object({ name: Type.String() });

export const ListRegionsSchema = {
    summary: "List supported regions",
    response: { 200: Type.Array(RegionSchema) },
};
