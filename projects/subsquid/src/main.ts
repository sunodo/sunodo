import { DataHandlerContext, EvmBatchProcessor } from "@subsquid/evm-processor";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import {
    Address,
    createPublicClient,
    custom,
    decodeEventLog,
    encodeEventTopics,
    getContract,
    Hex,
    PublicClient,
} from "viem";

import {
    authorityFactoryABI,
    authorityFactoryAddress,
    erc20ABI,
    payableDAppSystemABI,
    payableDAppSystemAddress,
} from "./abi/contracts";
import { Authority, Factory, Token } from "./model";
import { configureChain } from "./chain";
import { createDatasource } from "./datasource";

const chain = configureChain();
const dataSource = createDatasource(chain);

// finality confirmation on devnet can be 0
const finalityConfirmation = chain.id === 31337 ? 0 : 10;

// information about the deployment block of the contracts, so scan is optimized
const blocks: Record<string, Record<string, number>> = {
    foundry: { AuthorityFactory: 0, PayableDAppSystem: 0 },
    sepolia: { AuthorityFactory: 3976538, PayableDAppSystem: 4058614 },
};

// topic for AuthorityCreated event
const authorityCreatedTopics = encodeEventTopics({
    abi: authorityFactoryABI,
    eventName: "AuthorityCreated",
});

// topic for PayableDAppFactoryCreated event
const payableDAppFactoryCreatedTopics = encodeEventTopics({
    abi: payableDAppSystemABI,
    eventName: "PayableDAppFactoryCreated",
});

const processor = new EvmBatchProcessor()
    .setDataSource(dataSource)
    .setFinalityConfirmation(finalityConfirmation)
    .addLog({
        address: [authorityFactoryAddress],
        range: { from: blocks[chain.network].AuthorityFactory },
        topic0: [authorityCreatedTopics[0]],
    })
    .addLog({
        address: [payableDAppSystemAddress],
        range: { from: blocks[chain.network].PayableDAppSystem },
        topic0: [payableDAppFactoryCreatedTopics[0]],
    });

/**
 * Creates a viem public client using the subsquid configured chain
 * @param ctx subsquid context
 * @returns viem PublicClient
 */
const createClient = (ctx: DataHandlerContext<Store>): PublicClient => {
    const transport = custom({
        request: ({ method, params }) => {
            return ctx._chain.client.call(method, params);
        },
    });
    return createPublicClient({ transport });
};

/**
 * Creates a token entity by reading token information from the blockchain
 * @param address address of IERC20 token
 * @param publicClient viem public client
 * @returns token entity
 */
const createToken = async (
    address: Address,
    publicClient: PublicClient,
): Promise<Token> => {
    const token = getContract({
        abi: erc20ABI,
        address,
        publicClient,
    });
    return new Token({
        id: address.toString(),
        name: await token.read.name(),
        symbol: await token.read.symbol(),
        decimals: await token.read.decimals(),
    });
};

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    const publicClient = createClient(ctx);
    const authorities: Record<Address, Authority> = {};
    const tokens: Record<Address, Token> = {};
    const factories: Record<Address, Factory> = {};

    for (const block of ctx.blocks) {
        for (const log of block.logs) {
            if (
                log.address === authorityFactoryAddress.toLowerCase() &&
                log.topics[0] === authorityCreatedTopics[0]
            ) {
                const [signature, ...args] = log.topics.map((t) => t as Hex);
                const event = decodeEventLog({
                    abi: authorityFactoryABI,
                    topics: [signature, ...args],
                    data: log.data as Hex,
                    strict: true,
                });
                const { authority } = event.args;
                ctx.log.info(`saving authority ${authority}`);
                authorities[authority] = new Authority({
                    id: authority.toString(),
                });
            }

            if (
                log.address === payableDAppSystemAddress.toLowerCase() &&
                log.topics[0] == payableDAppFactoryCreatedTopics[0]
            ) {
                const [signature, ...args] = log.topics.map((t) => t as Hex);
                const event = decodeEventLog({
                    abi: payableDAppSystemABI,
                    topics: [signature, ...args],
                    data: log.data as Hex,
                    strict: true,
                });
                const { factory, token, consensus, price } = event.args;

                authorities[consensus] =
                    authorities[consensus] ||
                    (await ctx.store.get(Authority, consensus.toString()));

                // create token on demand
                tokens[token] =
                    tokens[token] ||
                    (await ctx.store.get(Token, token.toString())) ||
                    (await createToken(token, publicClient));

                ctx.log.info(`saving factory ${factory}`);
                factories[factory] = new Factory({
                    id: factory.toString(),
                    authority: authorities[consensus],
                    token: tokens[token],
                    price,
                });
            }
        }
    }

    ctx.store.save(Object.values(authorities));
    ctx.store.save(Object.values(tokens));
    ctx.store.save(Object.values(factories));
});
