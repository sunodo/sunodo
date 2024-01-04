import {
    VariantColorsResolver,
    defaultVariantColorsResolver,
    parseThemeColor,
} from "@mantine/core";

export const variantColorResolver: VariantColorsResolver = (input) => {
    const defaultResolvedColors = defaultVariantColorsResolver(input);
    const parsedColor = parseThemeColor({
        color: input.color || input.theme.primaryColor,
        theme: input.theme,
    });

    // Override button to use dark text on primary color
    if (
        parsedColor.isThemeColor &&
        parsedColor.color === "primary" &&
        input.variant === "filled"
    ) {
        return {
            ...defaultResolvedColors,
            color: "var(--mantine-color-black)",
        };
    }

    return defaultResolvedColors;
};
