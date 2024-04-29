import hardhatDeploy from "@sunodo/wagmi-plugin-hardhat-deploy";
import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { erc20Abi } from "viem";

export default defineConfig({
    out: "src/contracts.ts",
    contracts: [
        {
            name: "erc20",
            abi: erc20Abi,
        },
    ],
    plugins: [
        hardhatDeploy({ directory: "node_modules/@cartesi/devnet/export/abi" }),
        react(),
    ],
});
