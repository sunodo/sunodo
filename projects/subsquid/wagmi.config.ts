import { defineConfig } from "@wagmi/cli";
import hardhatDeploy from "@sunodo/wagmi-plugin-hardhat-deploy";

export default defineConfig({
    out: "src/abi/contracts.ts",
    plugins: [
        hardhatDeploy({
            directory: "../contracts/export/abi",
            includes: [/AuthorityFactory/],
        }),
    ],
});
