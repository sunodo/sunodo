import { Type } from "@sinclair/typebox";
import { NodeStatus } from "@prisma/client";
import { ErrorSchema } from "../../schemas";

const NodeSchema = Type.Object({
    app: Type.String(),
    chain: Type.String(),
    contractAddress: Type.String(),
    machineSnapshot: Type.String(),
    status: Type.Enum({
        STARTING: NodeStatus.STARTING,
        READY: NodeStatus.READY,
        FAILED: NodeStatus.FAILED,
    }),
    region: Type.String(),
    runtime: Type.String(),
});

export const CreateNodeResponseSchema = NodeSchema;

export const CreateNodeRequestSchema = Type.Pick(NodeSchema, [
    "chain",
    "contractAddress",
    "machineSnapshot",
    "region",
    "runtime",
]);

export const CreateNodeSchema = {
    summary: "Create node",
    body: CreateNodeRequestSchema,
    response: {
        201: CreateNodeResponseSchema,
        400: ErrorSchema,
        401: ErrorSchema,
    },
    params: Type.Object({
        app: Type.String(),
    }),
};

export const ListNodeSchema = {
    summary: "List nodes",
    response: {
        200: Type.Array(NodeSchema),
        401: ErrorSchema,
    },
    params: Type.Object({
        app: Type.String(),
    }),
};

export const GetNodeSchema = {
    summary: "Get node",
    response: {
        200: NodeSchema,
        401: ErrorSchema,
        404: ErrorSchema,
    },
    params: Type.Object({
        app: Type.String(),
        chain: Type.String(),
    }),
};

export const DeleteNodeSchema = {
    summary: "Delete node",
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
