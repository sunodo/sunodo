import { Type } from "@sinclair/typebox";
import { DeploymentStatus } from "@prisma/client";
import { ErrorSchema } from "../../schemas";

export const CreateDeploymentResponseSchema = Type.Object({
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

export const CreateDeploymentRequestSchema = Type.Pick(
    CreateDeploymentResponseSchema,
    ["chain", "contractAddress", "machineSnapshot", "region", "runtime"]
);

export const CreateDeploymentSchema = {
    body: CreateDeploymentRequestSchema,
    response: {
        201: CreateDeploymentResponseSchema,
        400: ErrorSchema,
    },
    params: Type.Object({
        app: Type.String(),
    }),
};
