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

const chains = [
    arbitrum,
    arbitrumGoerli,
    foundry,
    mainnet,
    optimism,
    optimismGoerli,
    sepolia,
];

export const configureChain = (): Chain => {
    // resolve network from NETWORK env variable, default to local foundry
    return chains.find((c) => c.network === process.env.NETWORK) || foundry;
};
