"use client";

import {
    CSSVariablesResolver,
    Container,
    DEFAULT_THEME,
    createTheme,
    mergeMantineTheme,
} from "@mantine/core";
import { colors } from "./colors";
import { typography } from "./typography";
import { variables } from "./variables";
import { variantColorResolver } from "./variantColorResolver";

export const variablesResolver: CSSVariablesResolver = ({ colors }) => ({
    variables,
    light: {
        "--mantine-color-text": colors.dark[3],
        "--mantine-color-anchor": colors.brand[9],
    },
    dark: {
        "--mantine-color-text": colors.dark[1],
        "--mantine-color-anchor": colors.brand[8],
    },
});

const themeOverride = createTheme({
    primaryColor: "brand",
    primaryShade: {
        light: 9,
        dark: 9,
    },
    white: "#fff",
    black: colors.dark[9],

    defaultRadius: "sm",
    fontFamily: "inherit",
    ...typography,
    colors,

    // TODO: not working in gap prop... Investigate
    spacing: {
        "2xl": "4rem",
        "3xl": "6rem",
    },

    radius: {
        sm: "0.33rem",
    },

    components: {
        Container: Container.extend({
            styles: {
                root: {
                    width: "100%",
                },
            },
            defaultProps: {
                size: "lg",
            },
        }),
    },

    variantColorResolver,
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
