import { Type } from "@sinclair/typebox";

export const ListRegionsSchema = {
    response: { 200: Type.Array(Type.Object({ name: Type.String() })) },
};
