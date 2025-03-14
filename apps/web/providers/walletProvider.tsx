"use client";

import { useMantineColorScheme } from "@mantine/core";
import {
    darkTheme,
    getDefaultConfig,
    lightTheme,
    RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    arbitrum,
    arbitrumSepolia,
    base,
    baseSepolia,
    foundry,
    mainnet,
    optimism,
    optimismSepolia,
    sepolia,
} from "viem/chains";
import { http, WagmiProvider } from "wagmi";

const projectId = "bc37f90dfcefc2900e5a86d366bf9aea";
const alchemyApiKey = process.env.ALCHEMY_API_KEY;
const queryClient = new QueryClient();

const config = getDefaultConfig({
    appName: "Sunodo",
    projectId,
    chains:
        process.env.NODE_ENV === "development"
            ? [
                  mainnet,
                  sepolia,
                  arbitrum,
                  arbitrumSepolia,
                  optimism,
                  optimismSepolia,
                  base,
                  baseSepolia,
                  foundry,
              ]
            : [
                  mainnet,
                  sepolia,
                  arbitrum,
                  arbitrumSepolia,
                  optimism,
                  optimismSepolia,
                  base,
                  baseSepolia,
              ],
    transports: {
        [mainnet.id]: http(
            `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
        ),
        [sepolia.id]: http(
            `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
        ),
        [arbitrum.id]: http(
            `https://arb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
        ),
        [arbitrumSepolia.id]: http(
            `https://arb-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
        ),
        [optimism.id]: http(
            `https://opt-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
        ),
        [optimismSepolia.id]: http(
            `https://opt-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
        ),
        [base.id]: http(
            `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
        ),
        [baseSepolia.id]: http(
            `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
        ),
        [foundry.id]: http(),
    },
    ssr: true,
});

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const scheme = useMantineColorScheme();
    const walletTheme =
        scheme.colorScheme === "dark" ? darkTheme() : lightTheme();

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={walletTheme}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export default WalletProvider;
