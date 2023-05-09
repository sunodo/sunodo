"use client";
import "@mantine/core/styles.css";
import React, { FC } from "react";
import { AppShell, Burger, ColorSchemeScript } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import StyleProvider from "../providers/styleProvider";
import WalletProvider from "../providers/walletProvider";
import Header from "../components/header";

const Layout: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [opened, { toggle }] = useDisclosure();
    return (
        <html lang="en">
            <head>
                <ColorSchemeScript />
                <link rel="shortcut icon" href="/favicon.svg" />
            </head>
            <body>
                <StyleProvider>
                    <WalletProvider>
                        <AppShell header={{ height: 60 }} padding="md">
                            <AppShell.Header>
                                <Burger
                                    opened={opened}
                                    onClick={toggle}
                                    hiddenFrom="sm"
                                    size="sm"
                                />
                                <Header />
                            </AppShell.Header>
                            <AppShell.Main>{children}</AppShell.Main>
                        </AppShell>
                    </WalletProvider>
                </StyleProvider>
            </body>
        </html>
    );
};

export default Layout;
