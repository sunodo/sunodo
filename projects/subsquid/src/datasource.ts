import { DataSource } from "@subsquid/evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import { Chain } from "viem/chains";

/**
 * Archives supported by Subsquid Aquarium
 */
const archives: Record<number, string> = {
    42161: lookupArchive("arbitrum"),
    421613: lookupArchive("arbitrum-goerli"),
    1: lookupArchive("eth-mainnet"),
    11155111: lookupArchive("sepolia"),
    // there is no support for optimism yet
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
        const envName = `PROVIDER_HTTP_URL_${chain.id}`;
        return process.env[envName] || chain.rpcUrls.public.http[0];
    }
};

export const createDatasource = (chain: Chain): DataSource => {
    return {
        archive: archives[chain.id],
        chain: chainURL(chain),
    };
};
