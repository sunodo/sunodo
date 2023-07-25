import { DataSource } from "@subsquid/evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import {
    Chain,
    arbitrum,
    arbitrumGoerli,
    foundry,
    mainnet,
    optimism,
    optimismGoerli,
    sepolia,
} from "@wagmi/chains";
import { Address } from "abitype";
import { encodeEventTopics } from "viem";

import {
    authorityFactoryABI,
    authorityFactoryAddress as authorityFactoryAddresses,
} from "./abi/contracts";

const chains = [
    arbitrum,
    arbitrumGoerli,
    foundry,
    mainnet,
    optimism,
    optimismGoerli,
    sepolia,
];

type EventConfig = {
    topic0: string;
};

type ContractConfig = {
    block: number;
    address: Address;
    events: Record<string, EventConfig>;
};

export type DatasourceConfig = {
    datasource: DataSource;
    finalityConfirmation: number;
    contracts: {
        AuthorityFactory: ContractConfig;
    };
};

/**
 * Archives supported by Subsquid Aquarium
 */
const archives: Record<string, string> = {
    arbitrum: lookupArchive("arbitrum"),
    "arbitrum-goerli": lookupArchive("arbitrum-goerli"),
    homestead: lookupArchive("eth-mainnet"),
    sepolia: lookupArchive("sepolia"),
    // there is no support for optimism yet
};

const blocks: Record<string, Record<string, number>> = {
    foundry: {
        AuthorityFactory: 0,
    },
    sepolia: {
        AuthorityFactory: 3976538,
    },
};

/**
 * Return a URL for a chain, which can be infura, alchemy, a custom, or a public one
 * @param chain chain to calculate the URL from
 * @returns chain URL
 */
const chainURL = (chain: Chain): string | undefined => {
    if (process.env.INFURA_ID && chain.rpcUrls.infura) {
        // return an infura URL as there is a secret INFURA_ID defined and chain supports infura
        return `${chain.rpcUrls.infura.http[0]}/${process.env.INFURA_ID}`;
    }
    if (process.env.ALCHEMY_ID && chain.rpcUrls.alchemy) {
        // return an infura URL as there is a secret INFURA_ID defined and chain supports infura
        return `${chain.rpcUrls.alchemy.http[0]}/${process.env.ALCHEMY_ID}`;
    } else {
        const envName = `${chain.network
            .replace("-", "_")
            .toUpperCase()}_HTTP_URL`;
        return process.env[envName] || chain.rpcUrls.public.http[0];
    }
};

export const createDatasource = (): DatasourceConfig => {
    // resolve network from NETWORK env variable, default is local foundry
    const chain: Chain =
        chains.find((c) => c.network === process.env.NETWORK) || foundry;

    // we don't need to wait on local foundry
    const finalityConfirmation = chain.id === 31337 ? 0 : 10;

    return {
        datasource: {
            archive: archives[chain.network],
            chain: chainURL(chain),
        },
        finalityConfirmation,
        contracts: {
            AuthorityFactory: {
                block: blocks[chain.network].AuthorityFactory || 0,
                address: authorityFactoryAddresses,
                events: {
                    AuthorityCreated: {
                        topic0: encodeEventTopics<
                            typeof authorityFactoryABI,
                            " AuthorityCreated"
                        >({
                            abi: authorityFactoryABI,
                        })[0],
                    },
                },
            },
        },
    };
};
