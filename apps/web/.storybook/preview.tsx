import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import React from "react";
import { useDarkMode } from "storybook-dark-mode";
import WalletProvider from "../providers/walletProvider";
import { theme } from "../theme/theme";

export const decorators = [
    // biome-ignore lint/suspicious/noExplicitAny: forgive storybook for now
    (renderStory: any) => <WalletProvider>{renderStory()}</WalletProvider>,
    // biome-ignore lint/suspicious/noExplicitAny: forgive storybook for now
    (renderStory: any) => (
        <MantineProvider
            theme={theme}
            forceColorScheme={useDarkMode() ? "dark" : "light"}
        >
            {renderStory()}
        </MantineProvider>
    ),
];
