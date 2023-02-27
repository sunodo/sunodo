import { Type } from "@sinclair/typebox";
import { ErrorSchema } from "../../schemas";

const DeploymentSchema = Type.Object({
    id: Type.String(),
    chain: Type.String(),
    contractAddress: Type.String(),
    machineSnapshot: Type.Optional(Type.String()),
});

export const CreateDeploymentResponseSchema = DeploymentSchema;

export const CreateDeploymentRequestSchema = Type.Pick(DeploymentSchema, [
    "chain",
    "contractAddress",
    "machineSnapshot",
]);

export const CreateDeploymentSchema = {
    summary: "Create deployment",
    operationId: "createDeployment",
    body: CreateDeploymentRequestSchema,
    response: {
        201: CreateDeploymentResponseSchema,
        400: ErrorSchema,
        401: ErrorSchema,
    },
};

export const ListDeploymentSchema = {
    summary: "List deployments",
    operationId: "listDeployments",
    response: {
        200: Type.Array(DeploymentSchema),
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

export const GetDeploymentSchema = {
    summary: "Get deployment",
    operationId: "getDeployment",
    response: {
        200: DeploymentSchema,
        401: ErrorSchema,
        404: ErrorSchema,
    },
    params: Type.Object({ id: Type.String() }),
};

export const DeleteDeploymentSchema = {
    summary: "Delete deployment",
    operationId: "deleteDeployment",
    response: {
        204: Type.Object({}),
        401: ErrorSchema,
        404: ErrorSchema,
    },
    params: Type.Object({ id: Type.String() }),
};
