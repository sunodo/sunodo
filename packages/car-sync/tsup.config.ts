import { defineConfig } from "tsup";

export default defineConfig({
    clean: true,
    dts: true,
    entry: ["src/cli.ts", "src/index.ts"],
    format: ["cjs", "esm"],
});
