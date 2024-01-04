import { MantineColorsTuple, DefaultMantineColor } from "@mantine/core";

type ExtendedCustomColors = "primary" | DefaultMantineColor;
type ExtendedCustomFontSizes = "h1" | "h2" | "h3" | "h4" | "h5";

declare module "@mantine/core" {
    export interface MantineThemeColorsOverride {
        colors: Record<ExtendedCustomColors, MantineColorsTuple>;
    }

    // TODO: not working -- see in theme.types.d.ts
    export interface MantineThemeFontSizesOverride {
        fontSizes: Record<ExtendedCustomFontSizes, string>;
    }
}
