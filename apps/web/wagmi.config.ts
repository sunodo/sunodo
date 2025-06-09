import hardhatDeploy from "@sunodo/wagmi-plugin-hardhat-deploy";
import { type Plugin, defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { type Abi, erc20Abi } from "viem";

const DataAvailability = JSON.parse(
    readFileSync(
        "node_modules/@cartesi/rollups/out/DataAvailability.sol/DataAvailability.json",
        "utf8",
    ),
);

interface CannonOptions {
    directory: string;
    includes?: RegExp[];
    excludes?: RegExp[];
    namePrefix?: string;
    nameSuffix?: string;
}

const shouldIncludeFile = (name: string, config: CannonOptions): boolean => {
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
    }
    // if there is no list of includes, then include everything
    return true;
};

const cannonDeployments = (config: CannonOptions): Plugin => {
    const { namePrefix = "", nameSuffix = "" } = config;
    return {
        name: "cannon",
        contracts: () => {
            // list all files exported by cannon in directory
            const files = readdirSync(config.directory).filter((file) =>
                shouldIncludeFile(file, config),
            );

            // return an array of contracts as expected by wagmi
            return files.map((file) => {
                // read the file and parse it as json
                const deployment = JSON.parse(
                    readFileSync(path.join(config.directory, file), "utf8"),
                );

                // get the address and abi from the deployment
                const { abi, address, contractName } = deployment;

                // build contract name
                const name = `${namePrefix}${contractName}${nameSuffix}`;

                return {
                    abi,
                    address,
                    name,
                };
            });
        },
    };
};

export default defineConfig({
    out: "src/contracts.ts",
    contracts: [
        {
            name: "erc20",
            abi: erc20Abi,
        },
        {
            name: "DataAvailability",
            abi: DataAvailability.abi as Abi,
        },
    ],
    plugins: [
        hardhatDeploy({
            directory: "node_modules/@cartesi/devnet-v1/export/abi",
        }),
        cannonDeployments({
            directory: "node_modules/@cartesi/devnet-v2/deployments",
            includes: [/^cartesiRollups/],
            nameSuffix: "V2",
        }),
        react(),
    ],
});
