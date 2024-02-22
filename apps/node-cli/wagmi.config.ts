import hardhatDeploy from "@sunodo/wagmi-plugin-hardhat-deploy";
import { defineConfig } from "@wagmi/cli";
import { hardhat } from "@wagmi/cli/plugins";

export default defineConfig({
    out: "src/contracts.ts",
    plugins: [
        hardhat({
            include: [
                "**/IFinancialProtocol.json",
                "**/IMachineProtocol.json",
                "**/IValidatorNodeProvider.json",
            ],
            project: "../../packages/contracts",
        }),
        hardhatDeploy({ directory: "../../packages/devnet/export/abi" }),
    ],
});
