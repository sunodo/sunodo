import "@rainbow-me/rainbowkit/styles.css";
import {
    RainbowKitProvider,
    getDefaultWallets,
    connectorsForWallets,
    darkTheme,
    lightTheme,
} from "@rainbow-me/rainbowkit";
import {
    argentWallet,
    trustWallet,
    ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { sepolia, hardhat } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { useMantineTheme } from "@mantine/core";

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
            ? [sepolia, hardhat]
            : []),
    ],
    [publicProvider()]
);

const projectId = "sunodo";
const { wallets } = getDefaultWallets({
    appName: "Sunodo",
    projectId,
    chains,
});

const appInfo = {
    appName: "Sunodo",
    learnMoreUrl: "httsp://sunodo.io",
};

const connectors = connectorsForWallets([
    ...wallets,
    {
        groupName: "Other",
        wallets: [
            argentWallet({ chains, projectId }),
            trustWallet({ chains, projectId }),
            ledgerWallet({ chains, projectId }),
        ],
    },
]);

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
});

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const theme = useMantineTheme();
    const walletTheme =
        theme.colorScheme == "dark" ? darkTheme() : lightTheme();

    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider
                appInfo={appInfo}
                chains={chains}
                theme={walletTheme}
            >
                {children}
            </RainbowKitProvider>
        </WagmiConfig>
    );
};

export default WalletProvider;
