import {
    BlockData,
    DataHandlerContext,
    EvmBatchProcessor,
} from "@subsquid/evm-processor";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";

import {
    Authority,
    ValidatorNodeProvider,
    Token,
    Application,
    ValidatorNode,
} from "./model";
import { configureChain } from "./chain";
import { createDatasource } from "./datasource";
import {
    authorityFactoryAddress,
    blocks,
    cartesiDAppFactoryAddress,
    marketplaceAddress,
} from "./config";
import { events as CartesiDAppFactoryEvents } from "./abi/CartesiDAppFactory";
import { events as AuthorityFactoryEvents } from "./abi/AuthorityFactory";
import { events as MarketplaceEvents } from "./abi/Marketplace";
import { events as ValidatorNodeProviderEvents } from "./abi/ValidatorNodeProvider";
import { Contract as ERC20 } from "./abi/ERC20";

const chain = configureChain();
const dataSource = createDatasource(chain);

// finality confirmation on devnet can be 0
const finalityConfirmation = chain.id === 31337 ? 0 : 10;

const processor = new EvmBatchProcessor()
    .setDataSource(dataSource)
    .setFinalityConfirmation(finalityConfirmation)
    .setFields({
        log: { topics: true, data: true },
        transaction: { hash: true },
    })
    .addLog({
        address: [cartesiDAppFactoryAddress],
        range: { from: blocks[chain.id].CartesiDAppFactory },
        topic0: [CartesiDAppFactoryEvents.ApplicationCreated.topic],
    })
    .addLog({
        address: [authorityFactoryAddress],
        range: { from: blocks[chain.id].AuthorityFactory },
        topic0: [AuthorityFactoryEvents.AuthorityCreated.topic],
    })
    .addLog({
        address: [marketplaceAddress],
        range: { from: blocks[chain.id].Marketplace },
        topic0: [MarketplaceEvents.ValidatorNodeProviderCreated.topic],
    })
    .addLog({
        topic0: [ValidatorNodeProviderEvents.MachineLocation.topic],
        transaction: true,
    })
    .addLog({
        topic0: [ValidatorNodeProviderEvents.FinancialRunway.topic],
        transaction: true,
    })
    .addLog({
        topic0: [ValidatorNodeProviderEvents.Paused.topic],
        transaction: true,
    })
    .addLog({
        topic0: [ValidatorNodeProviderEvents.Unpaused.topic],
        transaction: true,
    });

/**
 * Creates a token entity by reading token information from the blockchain
 * @param address address of IERC20 token
 * @returns token entity
 */
const createToken = async (
    address: string,
    ctx: DataHandlerContext<Store>,
    block: BlockData<{}>,
): Promise<Token> => {
    const token = new ERC20(ctx, block.header, address);
    return new Token({
        id: address.toString(),
        name: await token.name(),
        symbol: await token.symbol(),
        decimals: await token.decimals(),
    });
};

const topicNames: Record<string, string> = {
    [CartesiDAppFactoryEvents.ApplicationCreated.topic]: "ApplicationCreated",
    [AuthorityFactoryEvents.AuthorityCreated.topic]: "AuthorityCreated",
    [MarketplaceEvents.ValidatorNodeProviderCreated.topic]:
        "ValidatorNodeProviderCreated",
    [ValidatorNodeProviderEvents.MachineLocation.topic]: "MachineLocation",
    [ValidatorNodeProviderEvents.FinancialRunway.topic]: "FinancialRunway",
    [ValidatorNodeProviderEvents.Paused.topic]: "Paused",
    [ValidatorNodeProviderEvents.Unpaused.topic]: "Unpaused",
};

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    const authorities: Record<string, Authority> = {};
    const tokens: Record<string, Token> = {};
    const applications: Record<string, Application> = {};
    const providers: Record<string, ValidatorNodeProvider> = {};
    const validatorNodes: Record<string, ValidatorNode> = {};

    for (const block of ctx.blocks) {
        for (const log of block.logs) {
            const t0 = log.topics[0];
            const laddr = log.address.toLowerCase();

            if (
                laddr === authorityFactoryAddress.toLowerCase() &&
                t0 === AuthorityFactoryEvents.AuthorityCreated.topic
            ) {
                const { authority } =
                    AuthorityFactoryEvents.AuthorityCreated.decode(log);
                ctx.log.info(`${authority} -> Authority`);
                authorities[authority] = new Authority({
                    id: authority.toString(),
                });
            }

            if (
                laddr === marketplaceAddress.toLowerCase() &&
                t0 === MarketplaceEvents.ValidatorNodeProviderCreated.topic
            ) {
                let { provider, consensus, token, payee, price } =
                    MarketplaceEvents.ValidatorNodeProviderCreated.decode(log);
                provider = provider.toLowerCase();

                authorities[consensus] =
                    authorities[consensus] ||
                    (await ctx.store.get(Authority, consensus.toString()));

                // create token on demand
                tokens[token] =
                    tokens[token] ||
                    (await ctx.store.get(Token, token.toString())) ||
                    (await createToken(token, ctx, block));

                ctx.log.info(`${provider} -> ValidatorNodeProvider`);
                providers[provider] = new ValidatorNodeProvider({
                    id: provider.toString(),
                    authority: authorities[consensus],
                    token: tokens[token],
                    payee,
                    price,
                    paused: false,
                });
            }

            if (
                laddr === cartesiDAppFactoryAddress.toLowerCase() &&
                t0 === CartesiDAppFactoryEvents.ApplicationCreated.topic
            ) {
                const { application } =
                    CartesiDAppFactoryEvents.ApplicationCreated.decode(log);

                ctx.log.info(`${application} -> Application`);
                applications[application] = new Application({
                    id: application,
                });
            }

            ctx.log.info(`${laddr} ${topicNames[t0]}`);
            if (providers[laddr]) {
                const provider = providers[laddr];
                if (t0 === ValidatorNodeProviderEvents.MachineLocation.topic) {
                    const { dapp, location } =
                        ValidatorNodeProviderEvents.MachineLocation.decode(log);
                    const node =
                        validatorNodes[`${laddr}-${dapp}`] ||
                        new ValidatorNode({
                            id: `${laddr}-${dapp}`,
                            provider,
                            application: applications[dapp],
                        });
                    node.location = location;
                    validatorNodes[`${laddr}-${dapp}`] = node;
                }
                if (t0 === ValidatorNodeProviderEvents.FinancialRunway.topic) {
                    const { dapp, until } =
                        ValidatorNodeProviderEvents.FinancialRunway.decode(log);
                    const node =
                        validatorNodes[`${laddr}-${dapp}`] ||
                        new ValidatorNode({
                            id: `${laddr}-${dapp}`,
                            provider,
                            application: applications[dapp],
                        });
                    node.runway = until;
                    validatorNodes[`${laddr}-${dapp}`] = node;
                }
                if (t0 === ValidatorNodeProviderEvents.Paused.topic) {
                    provider.paused = true;
                }
                if (t0 === ValidatorNodeProviderEvents.Unpaused.topic) {
                    provider.paused = false;
                }
            }
        }
    }

    ctx.store.save(Object.values(authorities));
    ctx.store.save(Object.values(tokens));
    ctx.store.save(Object.values(applications));
    ctx.store.save(Object.values(providers));
    ctx.store.save(Object.values(validatorNodes));
});
