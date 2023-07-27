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
    includes?: RegExp[];
    excludes?: RegExp[];
}

const shouldInclude = (name: string, config: HardhatDeployOptions): boolean => {
    if (config.excludes) {
        // if there is a list of excludes, then if the name matches any of them, then exclude
        for (const exclude of config.excludes) {
            if (exclude.test(name)) {
                return false;
            }
        }
    }
    if (config.includes) {
        // if there is a list of includes, then only include if the name matches any of them
        for (const include of config.includes) {
            if (include.test(name)) {
                return true;
            }
        }
        return false;
    } else {
        // if there is no list of includes, then include everything
        return true;
    }
};

const plugin = (config: HardhatDeployOptions): Plugin => {
    return {
        name: "hardhat-deploy",
        contracts: () => {
            // list all files exported by hardhat-deploy
            const files = fs.readdirSync(config.directory);

            // build a collection of contracts as expected by wagmi (ContractConfig) indexed by name
            const contracts = files.reduce<Record<string, ContractConfig>>(
                (acc, file) => {
                    // read export file (hardhat-deploy format)
                    const filename = path.join(config.directory, file);
                    const deployment = JSON.parse(
                        fs.readFileSync(filename).toString()
                    ) as Export;
                    const chainId = parseInt(deployment.chainId);

                    // merge this contract with pontentially existing contract from other chain
                    Object.entries(deployment.contracts).forEach(
                        ([name, { abi, address }]) => {
                            if (shouldInclude(name, config)) {
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
