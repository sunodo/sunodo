import { getSingletonFactoryInfo } from "@safe-global/safe-singleton-factory";
import { HardhatUserConfig } from "hardhat/config";
import { HttpNetworkUserConfig } from "hardhat/types";
import path from "path";

import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-viem";
import "hardhat-abi-exporter";
import "hardhat-deploy";
import "solidity-docgen";

import {
    Chain,
    arbitrum,
    arbitrumSepolia,
    base,
    mainnet,
    optimism,
    optimismSepolia,
    sepolia,
} from "viem/chains";

// read MNEMONIC from env variable
let mnemonic = process.env.MNEMONIC;
let privateKey = process.env.PRIVATE_KEY;

const DEFAULT_DEVNET_MNEMONIC =
    "test test test test test test test test test test test junk";

const ppath = (packageName: string, pathname: string) => {
    return path.join(
        path.dirname(require.resolve(`${packageName}/package.json`)),
        pathname,
    );
};

const networkConfig = (chain: Chain): HttpNetworkUserConfig => {
    let url = chain.rpcUrls.default.http.at(0);

    // support for infura and alchemy URLs through env variables
    if (process.env.INFURA_ID && chain.rpcUrls.infura?.http) {
        url = `${chain.rpcUrls.infura.http}/${process.env.INFURA_ID}`;
    } else if (process.env.ALCHEMY_ID && chain.rpcUrls.alchemy?.http) {
        url = `${chain.rpcUrls.alchemy.http}/${process.env.ALCHEMY_ID}`;
    }

    return {
        chainId: chain.id,
        url,
        accounts: mnemonic
            ? { mnemonic }
            : privateKey
              ? [privateKey]
              : undefined,
    };
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
        arbitrum_sepolia: networkConfig(arbitrumSepolia),
        arbitrum: networkConfig(arbitrum),
        base: networkConfig(base),
        mainnet: networkConfig(mainnet),
        optimism: networkConfig(optimism),
        optimism_sepolia: networkConfig(optimismSepolia),
        sepolia: networkConfig(sepolia),
    },
    external: external(
        [
            "arbitrum",
            "arbitrum_sepolia",
            "base",
            "mainnet",
            "optimism",
            "optimism_sepolia",
            "sepolia",
        ],
        ["@cartesi/util", "@cartesi/rollups"],
    ),
    docgen: {
        pages: "single",
        outputDir: "../../apps/docs/reference/contracts",
    },
    namedAccounts: {
        deployer: 0,
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    sourcify: {
        enabled: true,
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
