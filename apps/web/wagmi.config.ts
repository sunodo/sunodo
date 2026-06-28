import devnet from "@cartesi/devnet/deployments/anvil.json" with {
    type: "json",
};
import dataAvailability from "@cartesi/rollups/out/DataAvailability.sol/DataAvailability.json" with { type: "json" };
import inputBox from "@cartesi/rollups/out/InputBox.sol/InputBox.json" with {
    type: "json",
};
import selfHostedApplicationFactory from "@cartesi/rollups/out/SelfHostedApplicationFactory.sol/SelfHostedApplicationFactory.json" with { type: "json" };
import { type Config, defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { type Abi, type Address, erc20Abi } from "viem";

// Rollups contracts are deployed at deterministic (CREATE2) addresses, identical
// across every chain, so a single address from the devnet deployment applies everywhere.
const { contracts } = devnet;

const config = defineConfig({
    out: "src/contracts.ts",
    contracts: [
        {
            name: "erc20",
            abi: erc20Abi,
        },
        {
            name: "selfHostedApplicationFactory",
            abi: selfHostedApplicationFactory.abi as Abi,
            address: contracts.SelfHostedApplicationFactory.address as Address,
        },
        {
            name: "inputBox",
            abi: inputBox.abi as Abi,
            address: contracts.InputBox.address as Address,
        },
        {
            // abi only: used client-side to encode the `dataAvailability` bytes
            name: "dataAvailability",
            abi: dataAvailability.abi as Abi,
        },
    ],
    plugins: [react()],
});

export default config as Config;
