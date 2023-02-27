import { Authority__factory, CartesiDApp__factory } from "@cartesi/rollups";
import { ConsensusType, Prisma } from "@prisma/client";
import { JsonRpcProvider } from "ethers";
import { RouteHandlerMethodTypebox } from "../../types";
import {
    CreateDeploymentSchema,
    DeleteDeploymentSchema,
    GetDeploymentSchema,
    ListDeploymentSchema,
} from "./deployments.schemas";

export const createHandler: RouteHandlerMethodTypebox<
    typeof CreateDeploymentSchema
> = async (request, reply) => {
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

    try {
        // query the contract for the authority address
        const provider = new JsonRpcProvider(chain.providerUrl);
        const dapp = CartesiDApp__factory.connect(
            request.body.contractAddress,
            provider
        );
        // XXX: assume it's authority, because that's the only one we have so far
        const authority = Authority__factory.connect(
            await dapp.getConsensus(),
            provider
        );
        const validator = await authority.owner();

        // get the authority consensus for the dapp validator, which have a key defined
        const consensus = await request.prisma.consensus.findFirstOrThrow({
            where: {
                type: ConsensusType.AUTHORITY,
                validators: {
                    some: { address: validator, keyRef: { not: null } },
                },
            },
        });

        // create deployment if doesn't exist
        const deployment = await request.prisma.deployment.upsert({
            // search by chain and address (pair is unique)
            where: {
                contractAddress_chainId: {
                    chainId: chain.id,
                    contractAddress: request.body.contractAddress,
                },
            },
            // if found, update the machine snapshot
            // XXX: should we do that blindly, or run the machine to verify the hash
            update: { machineSnapshot: request.body.machineSnapshot },
            // if doesn't exist, create one, with authority
            // XXX: should we do that blindly, or query the contract
            create: {
                contractAddress: request.body.contractAddress,
                chain: { connect: chain },
                consensus: { connect: consensus },
                machineSnapshot: request.body.machineSnapshot,
            },
        });

        return reply.code(200).send({
            id: deployment.id,
            chain: chain.name,
            contractAddress: deployment.contractAddress,
            machineSnapshot: deployment.machineSnapshot ?? undefined,
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
    const deployments = await request.prisma.deployment.findMany({
        where: { chain: { name: request.query.chain } },
        include: { chain: true },
    });

    return reply.code(200).send(
        deployments.map((d) => ({
            id: d.id,
            chain: d.chain.name,
            contractAddress: d.contractAddress,
            machineSnapshot: d.machineSnapshot!,
        }))
    );
};

export const getHandler: RouteHandlerMethodTypebox<
    typeof GetDeploymentSchema
> = async (request, reply) => {
    const deployment = await request.prisma.deployment.findUnique({
        where: { id: request.params.id },
        include: { chain: true },
    });

    return deployment
        ? reply.code(200).send({
              id: deployment.id,
              chain: deployment.chain.name,
              contractAddress: deployment.contractAddress,
              machineSnapshot: deployment.machineSnapshot!,
          })
        : reply.code(404).send();
};

export const deleteHandler: RouteHandlerMethodTypebox<
    typeof DeleteDeploymentSchema
> = async (request, reply) => {
    try {
        const deleted = await request.prisma.deployment.delete({
            where: { id: request.params.id },
        });
        return deleted ? reply.code(204).send() : reply.code(404).send();
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
