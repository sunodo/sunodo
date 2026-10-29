import { rollupsContracts } from "@cartesi/wagmi-plugin";
import { type Config, defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { erc20Abi } from "viem";

// ABIs and deployment addresses come from the rollups-contracts release the
// plugin targets. Rollups contracts are deployed at deterministic (CREATE2)
// addresses, identical across every chain.
const config = defineConfig({
    out: "src/contracts.ts",
    contracts: [
        {
            name: "erc20",
            abi: erc20Abi,
        },
    ],
    plugins: [
        rollupsContracts({
            include: [
                "UsdWithdrawalOutputBuilderFactory",
                "SelfHostedApplicationFactory",
                "InputBox",
            ],
        }),
        react(),
    ],
});

export default config as Config;
