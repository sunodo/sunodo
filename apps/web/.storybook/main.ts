import type { StorybookConfig } from "@storybook/nextjs";
import { dirname, join } from "path";
import { plugins } from "../postcss.config.cjs";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        getAbsolutePath("@storybook/addon-links"),
        getAbsolutePath("@storybook/addon-essentials"),
        getAbsolutePath("@storybook/addon-onboarding"),
        getAbsolutePath("@storybook/addon-interactions"),
        {
            name: getAbsolutePath("@storybook/addon-styling-webpack"),
            options: {
                rules: [
                    // Replaces existing CSS rules to support PostCSS
                    {
                        test: /\.css$/,
                        use: [
                            "style-loader",
                            {
                                loader: "css-loader",
                                options: { importLoaders: 1 },
                            },
                            {
                                // Gets options from `postcss.config.js` in your project root
                                loader: "postcss-loader",
                                options: {
                                    implementation: require.resolve("postcss"),
                                    // resolving conflict between the way nextjs expects the postcss config and the way storybook loads it
                                    // for some reason, storybook webpack configuration is not able to resolve the postcss config plugin location
                                    postcssOptions: {
                                        config: false,
                                        plugins: Object.entries(plugins).map(
                                            ([plugin, config]) =>
                                                require(plugin)(config),
                                        ),
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
        },
        getAbsolutePath("storybook-dark-mode"),
    ],
    framework: {
        name: getAbsolutePath("@storybook/nextjs"),
        options: {},
    },
    docs: {
        autodocs: "tag",
    },
};
export default config;
