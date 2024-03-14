import hardhatDeploy from "@sunodo/wagmi-plugin-hardhat-deploy";
import { defineConfig } from "@wagmi/cli";
import { hardhat, react } from "@wagmi/cli/plugins";
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
        hardhat({
            project: "node_modules/@sunodo/contracts",
            include: ["**/ValidatorNodeProvider.json"],
        }),
        hardhatDeploy({ directory: "node_modules/@sunodo/devnet/export/abi" }),
        react(),
    ],
});
