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

    // Add custom color for a secondary based on the brand color
    if (input.variant === "secondary") {
        if (parsedColor.color === "brand") {
            return {
                ...defaultResolvedColors,
                color: "var(--mantine-color-black)",
                hover: "var(--mantine-color-brand-7)",
                background: "var(--mantine-color-brand-6)",
            };
        }

        if (parsedColor.color === "dark") {
            return {
                ...defaultResolvedColors,
                color: "var(--mantine-color-white)",
                hover: "var(--mantine-color-dark-4)",
                background: "var(--mantine-color-dark-3)",
            };
        }
    }

    return defaultResolvedColors;
};
