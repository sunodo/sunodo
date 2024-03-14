module.exports = {
    root: true,
    extends: [
        "@sunodo/eslint-config/next.js",
        "plugin:@typescript-eslint/recommended",
        "plugin:storybook/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: true,
    },
};
