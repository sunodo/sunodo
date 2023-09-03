import { defineConfig } from "@wagmi/cli";
import { erc } from "@wagmi/cli/plugins";
import hardhatDeploy from "@sunodo/wagmi-plugin-hardhat-deploy";
import { Abi } from "viem";
import IPayableDAppFactory from "../../packages/contracts/export/artifacts/contracts/deploy/IPayableDAppFactory.sol/IPayableDAppFactory.json";
import IFinancialProtocol from "../../packages/contracts/export/artifacts/contracts/protocol/IFinancialProtocol.sol/IFinancialProtocol.json";
import IMachineProtocol from "../../packages/contracts/export/artifacts/contracts/protocol/IMachineProtocol.sol/IMachineProtocol.json";

export default defineConfig({
    out: "src/contracts.ts",
    contracts: [
        {
            name: IPayableDAppFactory.contractName,
            abi: IPayableDAppFactory.abi as Abi,
        },
        {
            name: IFinancialProtocol.contractName,
            abi: IFinancialProtocol.abi as Abi,
        },
        {
            name: IMachineProtocol.contractName,
            abi: IMachineProtocol.abi as Abi,
        },
    ],
    plugins: [
        hardhatDeploy({ directory: "../../packages/contracts/export/abi" }),
        erc(),
    ],
});
