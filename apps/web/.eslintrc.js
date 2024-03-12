module.exports = {
    root: true,
    env: {
        browser: true,
    },
    extends: ["@sunodo/eslint-config/next.js", "plugin:storybook/recommended"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: true,
    },
};
