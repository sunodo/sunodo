import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { useDarkMode } from "storybook-dark-mode";
import WalletProvider from "../providers/walletProvider";
import { theme } from "../theme/theme";

export const decorators = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (renderStory: any) => <WalletProvider>{renderStory()}</WalletProvider>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (renderStory: any) => (
        <MantineProvider
            theme={theme}
            forceColorScheme={useDarkMode() ? "dark" : "light"}
        >
            {renderStory()}
        </MantineProvider>
    ),
];
