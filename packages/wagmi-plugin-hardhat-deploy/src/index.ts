import fs from "fs";
import path from "path";
import type { ContractConfig, Plugin } from "@wagmi/cli";
import type { Abi, Address } from "abitype";

export interface ContractExport {
    address: Address;
    abi: Abi;
    linkedData?: any;
}

export interface Export {
    chainId: string;
    name: string;
    contracts: {
        [name: string]: ContractExport;
    };
}

export interface HardhatDeployOptions {
    directory: string;
}

const plugin = (config: HardhatDeployOptions): Plugin => {
    return {
        name: "hardhat-deploy",
        contracts: () => {
            const files = fs.readdirSync(config.directory);
            const contracts = files.reduce<Record<string, ContractConfig>>(
                (acc, file) => {
                    const deployment = JSON.parse(
                        fs
                            .readFileSync(path.join(config.directory, file))
                            .toString()
                    ) as Export;
                    const chainId = parseInt(deployment.chainId);

                    Object.entries(deployment.contracts).forEach(
                        ([name, { abi, address }]) => {
                            const contract = acc[name] || {
                                name,
                                abi,
                                address: {},
                            };
                            const addresses = contract.address as Record<
                                number,
                                Address
                            >;
                            addresses[chainId] = address;
                            acc[name] = contract;
                        }
                    );

                    return acc;
                },
                {}
            );

            return Object.values(contracts);
        },
    };
};

export default plugin;
