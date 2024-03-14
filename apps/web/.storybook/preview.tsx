import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import React from "react";
import { useDarkMode } from "storybook-dark-mode";
import WalletProvider from "../providers/walletProvider";
import { theme } from "../theme/theme";

export const decorators = [
    (renderStory: any) => <WalletProvider>{renderStory()}</WalletProvider>,
    (renderStory: any) => (
        <MantineProvider
            theme={theme}
            forceColorScheme={useDarkMode() ? "dark" : "light"}
        >
            {renderStory()}
        </MantineProvider>
    ),
];
