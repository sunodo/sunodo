import { getSingletonFactoryInfo } from "@safe-global/safe-singleton-factory";
import { HardhatUserConfig } from "hardhat/config";
import path from "path";

import "@nomicfoundation/hardhat-viem";
import "hardhat-abi-exporter";
import "hardhat-deploy";
import "./src/tasks/deploy-anvil";

// read MNEMONIC from env variable
let mnemonic = process.env.MNEMONIC;

const DEFAULT_DEVNET_MNEMONIC =
    "test test test test test test test test test test test junk";

const ppath = (packageName: string, pathname: string) => {
    return path.join(
        path.dirname(require.resolve(`${packageName}/package.json`)),
        pathname,
    );
};

const external = (networks: string[], packages: string[]) => ({
    contracts: packages.map((packageName) => ({
        artifacts: ppath(packageName, "/export/artifacts"),
        deploy: ppath(packageName, "/dist/deploy"),
    })),
    deployments: networks.reduce(
        (acc, network) => ({
            ...acc,
            [network]: packages.map((packageName) =>
                ppath(packageName, `/deployments/${network}`),
            ),
        }),
        {},
    ),
});

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.20",
        settings: { evmVersion: "paris" },
    },
    networks: {
        hardhat: mnemonic ? { accounts: { mnemonic } } : {},
        localhost: {
            url: process.env.RPC_URL || "http://127.0.0.1:8545",
            accounts: mnemonic
                ? { mnemonic }
                : {
                      mnemonic: DEFAULT_DEVNET_MNEMONIC,
                  },
        },
    },
    external: external(
        ["localhost"],
        [
            "@cartesi/util",
            "@cartesi/rollups",
            "@sunodo/token",
            "@sunodo/contracts",
        ],
    ),
    namedAccounts: {
        deployer: 0,
    },
    deterministicDeployment: (network: string) => {
        // networks will use another deterministic deployment proxy
        // https://github.com/safe-global/safe-singleton-factory
        const chainId = parseInt(network);
        const info = getSingletonFactoryInfo(chainId);
        if (info) {
            return {
                factory: info.address,
                deployer: info.signerAddress,
                funding: (
                    BigInt(info.gasPrice) * BigInt(info.gasLimit)
                ).toString(),
                signedTx: info.transaction,
            };
        } else {
            console.warn(
                `unsupported deterministic deployment for network ${network}`,
            );
            return undefined;
        }
    },
};

export default config;
