import k8s from "@kubernetes/client-node";
import { Deployment, DeploymentStatus, Prisma, Region } from "@prisma/client";
import { RouteHandlerMethodTypebox } from "../../types";
import { CreateDeploymentSchema } from "./deployments.schemas";

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
    const application = await request.prisma.application.findUnique({
        where: {
            name: request.params.app,
        },
        include: {
            organization: {
                include: {
                    members: {
                        where: {
                            userId: user.id,
                        },
                    },
                },
            },
        },
    });

    if (!application) {
        return reply.code(404);
    }

    // XXX: check authorization (user must be organization member)

    // get selected chain
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
