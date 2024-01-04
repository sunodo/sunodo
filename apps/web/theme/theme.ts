"use client";

import {
    CSSVariablesResolver,
    Container,
    Title,
    createTheme,
} from "@mantine/core";
import { variantColorResolver } from "./variantColorResolver";
import { colors } from "./colors";
import { variables } from "./variables";

export const variablesResolver: CSSVariablesResolver = () => ({
    variables,
    light: {
        "--mantine-color-text": "var(--mantine-color-gray-7)",
        "--mantine-color-anchor": "var(--mantine-color-primary-9)",
    },
    dark: {},
});

export const theme = createTheme({
    primaryColor: "primary",
    primaryShade: 6,
    white: "#fff",
    black: "var(--mantine-color-gray-9)",
    defaultRadius: "sm",

    colors,

    fontFamily: "inherit",
    headings: {
        fontFamily: "inherit",
        sizes: {
            h1: {
                fontSize: "var(--font-size-h1)",
                lineHeight: "1.2",
            },
            h2: { fontSize: "var(--font-size-h2)", lineHeight: "1.2" },
            h3: { fontSize: "var(--font-size-h3)", lineHeight: "1.2" },
            h4: { fontSize: "var(--font-size-h4)" },
            h5: { fontSize: "var(--font-size-h5)" },
        },
    },

    fontSizes: {
        h1: "var(--font-size-h1)",
        h2: "var(--font-size-h2)",
        h3: "var(--font-size-h3)",
        h4: "var(--font-size-h4)",
        h5: "var(--font-size-h5)",
    },

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
        Title: Title.extend({
            styles: {
                root: {
                    color: "var(--mantine-color-gray-9)",
                },
            },
        }),
    },

    variantColorResolver,
});
