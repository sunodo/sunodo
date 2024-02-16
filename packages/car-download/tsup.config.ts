import { defineConfig } from "tsup";

export default defineConfig({
    bundle: false,
    clean: true,
    dts: true,
    entry: ["src/cli.ts", "src/index.ts"],
    format: ["esm"],
    splitting: true,
    treeshake: true,
});
