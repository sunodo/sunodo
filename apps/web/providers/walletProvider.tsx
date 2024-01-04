"use client";

import { useMantineColorScheme } from "@mantine/core";
import {
    RainbowKitProvider,
    darkTheme,
    getDefaultWallets,
    lightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import {
    arbitrum,
    arbitrumSepolia,
    foundry,
    mainnet,
    optimism,
    optimismSepolia,
    sepolia,
} from "viem/chains";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const supportedChains = [
    arbitrum,
    arbitrumSepolia,
    foundry,
    mainnet,
    optimism,
    optimismSepolia,
    sepolia,
];

const projectId = "bc37f90dfcefc2900e5a86d366bf9aea";

const metadata = {
    name: "Sunodo",
    description: "Sunodo",
    url: "https://sunodo.io",
    icons: ["https://sunodo.io/logo-icon.svg"],
};

const { chains, publicClient } = configureChains(supportedChains, [
    publicProvider(),
]);

const { connectors } = getDefaultWallets({
    appName: "Sunodo",
    projectId,
    chains,
});

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
});

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const scheme = useMantineColorScheme();
    const walletTheme =
        scheme.colorScheme == "dark" ? darkTheme() : lightTheme();

    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains} theme={walletTheme}>
                {children}
            </RainbowKitProvider>
        </WagmiConfig>
    );
};

export default WalletProvider;
