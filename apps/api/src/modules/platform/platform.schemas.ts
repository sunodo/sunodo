import { Type } from "@sinclair/typebox";

export const ListChainsSchema = {
    response: {
        200: Type.Array(
            Type.Object({
                name: Type.String(),
                label: Type.String(),
                testnet: Type.Boolean(),
                enabled: Type.Boolean(),
            })
        ),
    },
};

export const ListRegionsSchema = {
    response: { 200: Type.Array(Type.Object({ name: Type.String() })) },
};

export const ListRuntimesSchema = {
    response: {
        200: Type.Array(
            Type.Object({
                name: Type.String(),
            })
        ),
    },
};
