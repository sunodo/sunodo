import { Type } from "@sinclair/typebox";
import { DeploymentStatus } from "@prisma/client";
import { ErrorSchema } from "../../schemas";

const DeploymentSchema = Type.Object({
    app: Type.String(),
    chain: Type.String(),
    contractAddress: Type.String(),
    machineSnapshot: Type.String(),
    status: Type.Enum({
        STARTING: DeploymentStatus.STARTING,
        READY: DeploymentStatus.READY,
        FAILED: DeploymentStatus.FAILED,
    }),
    region: Type.String(),
    runtime: Type.String(),
});

export const CreateDeploymentResponseSchema = DeploymentSchema;

export const CreateDeploymentRequestSchema = Type.Pick(DeploymentSchema, [
    "chain",
    "contractAddress",
    "machineSnapshot",
    "region",
    "runtime",
]);

export const CreateDeploymentSchema = {
    summary: "Create deployment",
    body: CreateDeploymentRequestSchema,
    response: {
        201: CreateDeploymentResponseSchema,
        400: ErrorSchema,
        401: ErrorSchema,
    },
    params: Type.Object({
        app: Type.String(),
    }),
};

export const ListDeploymentSchema = {
    summary: "List deployments",
    response: {
        200: Type.Array(DeploymentSchema),
        401: ErrorSchema,
    },
    params: Type.Object({
        app: Type.String(),
    }),
};

export const GetDeploymentSchema = {
    summary: "Get deployment",
    response: {
        200: DeploymentSchema,
        401: ErrorSchema,
        404: ErrorSchema,
    },
    params: Type.Object({
        app: Type.String(),
        chain: Type.String(),
    }),
};

export const DeleteDeploymentSchema = {
    summary: "Delete deployment",
    response: {
        204: Type.Object({}),
        401: ErrorSchema,
        404: ErrorSchema,
    },
    params: Type.Object({
        app: Type.String(),
        chain: Type.String(),
    }),
};
