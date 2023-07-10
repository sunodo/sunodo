import { defineConfig } from "@wagmi/cli";
import { erc, hardhat } from "@wagmi/cli/plugins";
import hardhatDeploy from "@sunodo/wagmi-plugin-hardhat-deploy";

export default defineConfig({
    out: "src/contracts.ts",
    plugins: [
        hardhat({
            project: "../../packages/contracts",
            include: ["**/IFinancialProtocol.json", "**/IMachineProtocol.json"],
        }),
        hardhatDeploy({ directory: "../../packages/contracts/export/abi" }),
        erc(),
    ],
});
