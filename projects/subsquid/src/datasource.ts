import { DataSource } from "@subsquid/evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import { Chain } from "@wagmi/chains";

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

export const createDatasource = (chain: Chain): DataSource => {
    return {
        archive: archives[chain.network],
        chain: chainURL(chain),
    };
};
