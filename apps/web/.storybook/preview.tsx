import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import React from "react";
import WalletProvider from "../providers/walletProvider";
import { theme } from "../theme/theme";

export const decorators = [
    // biome-ignore lint/suspicious/noExplicitAny: forgive storybook for now
    (renderStory: any) => <WalletProvider>{renderStory()}</WalletProvider>,
    // biome-ignore lint/suspicious/noExplicitAny: forgive storybook for now
    (renderStory: any) => (
        <MantineProvider theme={theme}>{renderStory()}</MantineProvider>
    ),
];
