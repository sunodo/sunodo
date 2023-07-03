import NextApp, { AppProps, AppContext } from "next/app";
import { getCookie } from "cookies-next";
import { ColorScheme } from "@mantine/core";
import StyleProvider from "../providers/styleProvider";
import WalletProvider from "../providers/walletProvider";

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
    const { Component, pageProps } = props;

    return (
        <StyleProvider colorScheme={props.colorScheme}>
            <WalletProvider>
                <Component {...pageProps} />
            </WalletProvider>
        </StyleProvider>
    );
}

App.getInitialProps = async (appContext: AppContext) => {
    const appProps = await NextApp.getInitialProps(appContext);
    return {
        ...appProps,
        colorScheme:
            getCookie("mantine-color-scheme", appContext.ctx) || "dark",
    };
};
