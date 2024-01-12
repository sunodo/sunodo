"use client";

import {
    CSSVariablesResolver,
    Container,
    DEFAULT_THEME,
    Progress,
    Rating,
    SegmentedControl,
    Slider,
    Stepper,
    Switch,
    Title,
    createTheme,
    mergeMantineTheme,
} from "@mantine/core";
import { colors } from "./colors";
import { typography } from "./typography";
import { variables } from "./variables";
import { variantColorResolver } from "./variantColorResolver";

export const variablesResolver: CSSVariablesResolver = () => ({
    variables,
    light: {
        "--mantine-color-text": "#737277",
        "--mantine-color-anchor": "var(--mantine-color-brand-9)",
    },
    dark: {},
});

const themeOverride = createTheme({
    primaryColor: "brand",
    primaryShade: 9,
    white: "#fff",
    black: "#1A191C",
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
        Title: Title.extend({
            styles: {
                root: {
                    color: "var(--mantine-color-gray-9)",
                },
            },
        }),
        Rating: Rating.extend({
            defaultProps: {
                color: "var(--mantine-color-brand-6)",
            },
        }),
        SegmentedControl: SegmentedControl.extend({
            styles: {
                root: {
                    backgroundColor: "var(--mantine-color-brand-0)",
                },
            },
        }),
        Slider: Slider.extend({
            styles: {
                root: {
                    "--slider-track-bg": "var(--mantine-color-brand-0)",
                    "--slider-color": "var(--mantine-color-brand-9)",
                },
            },
        }),
        Switch: Switch.extend({
            styles: {
                root: {
                    "--mantine-color-gray-2": "var(--mantine-color-brand-0)",
                },
            },
        }),
        Stepper: Stepper.extend({
            styles: {
                root: {
                    "--mantine-color-gray-1": "var(--mantine-color-brand-0)",
                },
            },
        }),
        Progress: Progress.extend({
            styles: {
                root: {
                    "--mantine-color-gray-2": "var(--mantine-color-brand-0)",
                },
            },
        }),
    },

    variantColorResolver,
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
