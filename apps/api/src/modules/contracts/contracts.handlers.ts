import { Authority__factory, CartesiDApp__factory } from "@cartesi/rollups";
import { ConsensusType, Prisma } from "@prisma/client";
import { JsonRpcProvider } from "ethers";
import { RouteHandlerMethodTypebox } from "../../types";
import {
    CreateContractSchema,
    DeleteContractSchema,
    GetContractSchema,
    ListContractSchema,
} from "./contracts.schemas";

export const createHandler: RouteHandlerMethodTypebox<
    typeof CreateContractSchema
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
            request.body.address,
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

        // create contract if doesn't exist
        const contract = await request.prisma.contract.upsert({
            // search by chain and address (pair is unique)
            where: {
                address_chainId: {
                    chainId: chain.id,
                    address: request.body.address,
                },
            },
            // if found, update the machine snapshot
            // XXX: should we do that blindly, or run the machine to verify the hash
            update: { templateHash: request.body.templateHash },
            // if doesn't exist, create one, with authority
            // XXX: should we do that blindly, or query the contract
            create: {
                address: request.body.address,
                chain: { connect: chain },
                consensus: { connect: consensus },
                templateHash: request.body.templateHash,
            },
        });

        return reply.code(200).send({
            id: contract.id,
            chain: chain.name,
            address: contract.address,
            templateHash: contract.templateHash ?? undefined,
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
    typeof ListContractSchema
> = async (request, reply) => {
    const contracts = await request.prisma.contract.findMany({
        where: { chain: { name: request.query.chain } },
        include: { chain: true },
    });

    return reply.code(200).send(
        contracts.map((d) => ({
            id: d.id,
            chain: d.chain.name,
            address: d.address,
            templateHash: d.templateHash!,
        }))
    );
};

export const getHandler: RouteHandlerMethodTypebox<
    typeof GetContractSchema
> = async (request, reply) => {
    const contract = await request.prisma.contract.findUnique({
        where: { id: request.params.id },
        include: { chain: true },
    });

    return contract
        ? reply.code(200).send({
              id: contract.id,
              chain: contract.chain.name,
              address: contract.address,
              templateHash: contract.templateHash!,
          })
        : reply.code(404).send();
};

export const deleteHandler: RouteHandlerMethodTypebox<
    typeof DeleteContractSchema
> = async (request, reply) => {
    try {
        const deleted = await request.prisma.contract.delete({
            where: { id: request.params.id },
        });
        return deleted ? reply.code(204).send() : reply.code(404).send();
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code == "P2003") {
                return reply.code(400).send({
                    statusCode: 400,
                    error: "Bad input",
                    message: "Cannot delete contract that has related data",
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
