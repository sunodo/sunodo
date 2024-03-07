module.exports = {
    root: true,
    extends: ["@sunodo/eslint-config/library.js"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ["./tsconfig.eslint.json", "./tsconfig.json"],
        tsconfigRootDir: __dirname,
    },
};
