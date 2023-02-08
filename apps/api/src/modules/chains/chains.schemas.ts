import { Type } from "@sinclair/typebox";

const ChainSchema = Type.Object({
    id: Type.Integer(),
    name: Type.String(),
    label: Type.String(),
    testnet: Type.Boolean(),
    enabled: Type.Boolean(),
});

export const ListChainsSchema = {
    summary: "List supported chains",
    response: {
        200: Type.Array(ChainSchema),
    },
};
