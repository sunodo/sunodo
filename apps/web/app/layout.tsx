import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import type { ReactNode } from "react";
import "./global.css";

import { Content } from "../components/Content/Content";
import { Footer } from "../components/Footer";
import { Gtm } from "../components/Gtm";
import { Header } from "../components/Header/Header";
import WalletProvider from "../providers/walletProvider";
import { theme, variablesResolver } from "../theme/theme";

import classes from "./layout.module.css";

export const metadata = {
    title: "Sunodo",
    description:
        "The easiest way to build, deploy and manage Cartesi Rollups DApps",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ColorSchemeScript defaultColorScheme="light" />
                <link rel="shortcut icon" href="/favicon.svg" />
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
                />
            </head>
            <body className={classes.wrapper}>
                <Gtm />
                <MantineProvider
                    theme={theme}
                    cssVariablesResolver={variablesResolver}
                >
                    <WalletProvider>
                        <Header />
                        <Content>{children}</Content>
                        <Footer />
                    </WalletProvider>
                </MantineProvider>
            </body>
        </html>
    );
}
