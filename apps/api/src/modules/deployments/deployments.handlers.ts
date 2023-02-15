import k8s from "@kubernetes/client-node";
import { Deployment, DeploymentStatus, Prisma, Region } from "@prisma/client";
import { RouteHandlerMethodTypebox } from "../../types";
import {
    CreateDeploymentSchema,
    DeleteDeploymentSchema,
    GetDeploymentSchema,
    ListDeploymentSchema,
} from "./deployments.schemas";

const deploy = async (deployment: Deployment, region: Region) => {
    const kc = new k8s.KubeConfig();
    kc.loadFromString(region.kubeConfigSecret);

    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    const k8sApiExtension = kc.makeApiClient(k8s.ApiextensionsV1Api);
    // k8sApiExtension.createCustomResourceDefinition({...});
};

export const createHandler: RouteHandlerMethodTypebox<
    typeof CreateDeploymentSchema
> = async (request, reply) => {
    const user = await request.prisma.user.findFirst({
        where: {
            subs: {
                has: request.user.sub,
            },
        },
    });

    // logged in user
    if (!user) {
        return reply.code(401).send();
    }

    // search by name of application
    const application = await request.prisma.application.findFirst({
        where: {
            name: request.params.app,
            account: {
                OR: [
                    { user: { subs: { has: request.user.sub } } },
                    {
                        organization: {
                            members: {
                                some: {
                                    user: { subs: { has: request.user.sub } },
                                },
                            },
                        },
                    },
                ],
            },
        },
    });

    if (!application) {
        return reply.code(404).send();
    }

    // XXX: use findFirstOrThrow and handle PrismaClientKnownRequestError with P2025
    // get selected chain
    request.prisma.chain.findFirstOrThrow({});
    const chain = await request.prisma.chain.findUnique({
        where: {
            name: request.body.chain,
        },
    });
    if (!chain) {
        return reply.code(400).send({
            statusCode: 400,
            error: "Invalid chain",
            message: `Invalid chain '${request.body.chain}`,
        });
    }

    // get selected region
    const region = await request.prisma.region.findUnique({
        where: {
            name: request.body.region,
        },
    });
    if (!region) {
        return reply.code(400).send({
            statusCode: 400,
            error: "Invalid region",
            message: `Invalid region '${request.body.region}`,
        });
    }

    // get selected runtime
    const runtime = await request.prisma.runtime.findUnique({
        where: {
            name: request.body.runtime,
        },
    });
    if (!runtime) {
        return reply.code(400).send({
            statusCode: 400,
            error: "Invalid runtime",
            message: `Invalid runtime '${request.body.runtime}`,
        });
    }

    try {
        // create deployment
        const deployment = await request.prisma.deployment.create({
            data: {
                applicationId: application.id,
                chainId: chain.id,
                regionId: region.id,
                runtimeId: runtime.id,
                contractAddress: request.body.contractAddress,
                machineSnapshot: request.body.machineSnapshot,
                status: DeploymentStatus.STARTING,
            },
        });

        // deploy to k8s
        await deploy(deployment, region);

        return reply.code(200).send({
            app: application.name,
            chain: chain.name,
            contractAddress: deployment.contractAddress,
            machineSnapshot: deployment.machineSnapshot,
            region: region.name,
            runtime: runtime.name,
            status: deployment.status,
        });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                return reply.code(400).send({
                    statusCode: 400,
                    error: e.code,
                    message: e.message,
                });
            }
        }
    }
};

export const listHandler: RouteHandlerMethodTypebox<
    typeof ListDeploymentSchema
> = async (request, reply) => {
    // filter of logged on user
    const account: Prisma.AccountWhereInput = {
        OR: [
            { user: { subs: { has: request.user.sub } } },
            {
                organization: {
                    members: {
                        some: { user: { subs: { has: request.user.sub } } },
                    },
                },
            },
        ],
    };

    const deployments = await request.prisma.deployment.findMany({
        where: { application: { name: request.params.app, account } },
        include: {
            application: true,
            chain: true,
            region: true,
            runtime: true,
        },
    });

    return reply.code(200).send(
        deployments.map((d) => ({
            app: d.application.name,
            chain: d.chain.name,
            contractAddress: d.contractAddress,
            machineSnapshot: d.machineSnapshot,
            region: d.region.name,
            runtime: d.runtime.name,
            status: d.status,
        }))
    );
};

export const getHandler: RouteHandlerMethodTypebox<
    typeof GetDeploymentSchema
> = async (request, reply) => {
    // filter of logged on user
    const account: Prisma.AccountWhereInput = {
        OR: [
            { user: { subs: { has: request.user.sub } } },
            {
                organization: {
                    members: {
                        some: { user: { subs: { has: request.user.sub } } },
                    },
                },
            },
        ],
    };

    const deployment = await request.prisma.deployment.findFirst({
        where: { application: { name: request.params.app, account } },
        include: {
            application: true,
            chain: true,
            region: true,
            runtime: true,
        },
    });

    return deployment
        ? reply.code(200).send({
              app: deployment.application.name,
              chain: deployment.chain.name,
              contractAddress: deployment.contractAddress,
              machineSnapshot: deployment.machineSnapshot,
              region: deployment.region.name,
              runtime: deployment.runtime.name,
              status: deployment.status,
          })
        : reply.code(404).send();
};

export const deleteHandler: RouteHandlerMethodTypebox<
    typeof DeleteDeploymentSchema
> = async (request, reply) => {
    // filter of logged on user
    const account: Prisma.AccountWhereInput = {
        OR: [
            { user: { subs: { has: request.user.sub } } },
            {
                organization: {
                    members: {
                        some: { user: { subs: { has: request.user.sub } } },
                    },
                },
            },
        ],
    };

    try {
        const deleted = await request.prisma.deployment.deleteMany({
            where: { application: { name: request.params.app, account } },
        });
        return deleted.count > 0
            ? reply.code(204).send()
            : reply.code(404).send();
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code == "P2003") {
                return reply.code(400).send({
                    statusCode: 400,
                    error: "Bad input",
                    message: "Cannot delete deployment that has related data",
                });
            }
            return reply.code(400).send({
                statusCode: 400,
                error: e.code,
                message: e.message,
            });
        } else {
            return reply.code(500).send({
                statusCode: 400,
                message: "Unknown error",
            });
        }
    }
};
