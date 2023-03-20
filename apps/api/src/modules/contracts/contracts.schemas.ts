import { Type } from "@sinclair/typebox";
import { ErrorSchema } from "../../schemas";

const ContractSchema = Type.Object({
    id: Type.String(),
    chain: Type.String(),
    address: Type.String(),
    templateHash: Type.String(),
});

export const CreateContractResponseSchema = ContractSchema;

export const CreateContractRequestSchema = Type.Pick(ContractSchema, [
    "chain",
    "address",
    "templateHash",
]);

export const CreateContractSchema = {
    summary: "Create contract",
    operationId: "createContract",
    body: CreateContractRequestSchema,
    response: {
        201: CreateContractResponseSchema,
        400: ErrorSchema,
        401: ErrorSchema,
    },
};

export const ListContractSchema = {
    summary: "List contracts",
    operationId: "listContracts",
    response: {
        200: Type.Array(ContractSchema),
        401: ErrorSchema,
    },
    querystring: Type.Object({
        chain: Type.Optional(
            Type.String({
                description: "chain filter",
                examples: ["5", "goerli"],
            })
        ),
    }),
};

export const GetContractSchema = {
    summary: "Get contract",
    operationId: "getContract",
    response: {
        200: ContractSchema,
        401: ErrorSchema,
        404: ErrorSchema,
    },
    params: Type.Object({ id: Type.String() }),
};

export const DeleteContractSchema = {
    summary: "Delete contract",
    operationId: "deleteContract",
    response: {
        204: Type.Object({}),
        401: ErrorSchema,
        404: ErrorSchema,
    },
    params: Type.Object({ id: Type.String() }),
};
