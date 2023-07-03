import { FC, useState } from "react";
import { setCookie } from "cookies-next";
import {
    ColorScheme,
    ColorSchemeProvider,
    MantineProvider,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export type StyleProviderProps = {
    colorScheme: ColorScheme;
    children?: React.ReactNode;
};

const StyleProvider: FC<StyleProviderProps> = (props) => {
    const [colorScheme, setColorScheme] = useState<ColorScheme>(
        props.colorScheme
    );

    const toggleColorScheme = (value?: ColorScheme) => {
        const nextColorScheme =
            value || (colorScheme === "dark" ? "light" : "dark");
        setColorScheme(nextColorScheme);
        setCookie("mantine-color-scheme", nextColorScheme, {
            maxAge: 60 * 60 * 24 * 30,
        });
    };

    return (
        <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
        >
            <MantineProvider
                theme={{ colorScheme }}
                withGlobalStyles
                withNormalizeCSS
            >
                {props.children}
                <Notifications />
            </MantineProvider>
        </ColorSchemeProvider>
    );
};

export default StyleProvider;
