"use client";

import { useMantineColorScheme } from "@mantine/core";
import {
    RainbowKitProvider,
    darkTheme,
    getDefaultConfig,
    lightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { foundry, sepolia } from "viem/chains";
import { WagmiProvider } from "wagmi";

const projectId = "bc37f90dfcefc2900e5a86d366bf9aea";
const queryClient = new QueryClient();

const config = getDefaultConfig({
    appName: "Sunodo",
    projectId,
    chains:
        process.env.NODE_ENV === "development" ? [sepolia, foundry] : [sepolia],
    ssr: true,
});

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const scheme = useMantineColorScheme();
    const walletTheme =
        scheme.colorScheme == "dark" ? darkTheme() : lightTheme();

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
