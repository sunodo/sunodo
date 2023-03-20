import k8s from "@kubernetes/client-node";
import { Node, NodeStatus, Prisma, Region } from "@prisma/client";
import { RouteHandlerMethodTypebox } from "../../types";
import {
    CreateNodeSchema,
    DeleteNodeSchema,
    GetNodeSchema,
    ListNodeSchema,
} from "./nodes.schemas";

const deploy = async (node: Node, region: Region) => {
    const kc = new k8s.KubeConfig();
    kc.loadFromString(region.kubeConfigSecret);

    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    const k8sApiExtension = kc.makeApiClient(k8s.ApiextensionsV1Api);
    // k8sApiExtension.createCustomResourceDefinition({...});
    // TODO
};

const getMachineHash = async (url: string) => {
    // TODO
    return "0xdeadbeef";
};

export const createHandler: RouteHandlerMethodTypebox<
    typeof CreateNodeSchema
> = async (request, reply) => {
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
    const chainId = parseInt(request.body.chain); // try to parse by id (number)
    const chainCriteria: Prisma.ChainWhereInput =
        chainId > 0 ? { id: chainId } : { name: request.body.chain };
    const chain = await request.prisma.chain.findFirst({
        where: chainCriteria,
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
        // get the first consensus which have a key defined
        // TODO: change this
        const authority = await request.prisma.consensus.findFirstOrThrow({
            where: { validators: { some: { keyRef: { not: null } } } },
        });

        // create contract from chain and address if doesn't exist
        const contract = await request.prisma.contract.upsert({
            // search by chain and address (pair is unique)
            where: {
                address_chainId: {
                    chainId: chain.id,
                    address: request.body.contractAddress,
                },
            },
            // if found, update the machine snapshot
            // XXX: should we do that blindly, or run the machine to verify the hash
            update: { templateHash: request.body.machineSnapshot },
            // if doesn't exist, create one, with authority
            // XXX: should we do that blindly, or query the contract
            create: {
                address: request.body.contractAddress,
                chain: { connect: chain },
                consensus: { connect: authority },
                templateHash: request.body.machineSnapshot,
            },
        });

        // create machine from url if doesn't exist
        const machine = await request.prisma.machine.upsert({
            where: { url: request.body.machineSnapshot },
            create: {
                url: request.body.machineSnapshot,
                hash: await getMachineHash(request.body.machineSnapshot),
            },
            update: {
                hash: await getMachineHash(request.body.machineSnapshot),
            },
        });

        // create application node
        const node = await request.prisma.node.create({
            data: {
                status: NodeStatus.STARTING,
                application: { connect: application },
                region: { connect: region },
                runtime: { connect: runtime },
                contract: { connect: contract },
                machine: { connect: machine },
            },
            include: { contract: true, machine: true },
        });

        // deploy to k8s
        await deploy(node, region);

        return reply.code(200).send({
            app: application.name,
            chain: chain.name,
            contractAddress: node.contract.address,
            machineSnapshot: node.machine.url, // at this point we must have a machine snapshot
            region: region.name,
            runtime: runtime.name,
            status: node.status,
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
    typeof ListNodeSchema
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

    const nodes = await request.prisma.node.findMany({
        where: { application: { name: request.params.app, account } },
        include: {
            application: true,
            region: true,
            runtime: true,
            contract: { include: { chain: true } },
            machine: true,
        },
    });

    return reply.code(200).send(
        nodes.map((d) => ({
            app: d.application.name,
            chain: d.contract.chain.name,
            contractAddress: d.contract.address,
            machineSnapshot: d.machine.url,
            region: d.region.name,
            runtime: d.runtime.name,
            status: d.status,
        }))
    );
};

export const getHandler: RouteHandlerMethodTypebox<
    typeof GetNodeSchema
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

    const node = await request.prisma.node.findFirst({
        where: { application: { name: request.params.app, account } },
        include: {
            application: true,
            contract: { include: { chain: true } },
            machine: true,
            region: true,
            runtime: true,
        },
    });

    return node
        ? reply.code(200).send({
              app: node.application.name,
              chain: node.contract.chain.name,
              contractAddress: node.contract.address,
              machineSnapshot: node.machine.hash,
              region: node.region.name,
              runtime: node.runtime.name,
              status: node.status,
          })
        : reply.code(404).send();
};

export const deleteHandler: RouteHandlerMethodTypebox<
    typeof DeleteNodeSchema
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
        const deleted = await request.prisma.node.deleteMany({
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
                    message: "Cannot delete node that has related data",
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
