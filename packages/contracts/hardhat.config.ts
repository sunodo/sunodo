import path from "path";
import { HardhatUserConfig } from "hardhat/config";
import { HttpNetworkUserConfig } from "hardhat/types";
import { getSingletonFactoryInfo } from "@safe-global/safe-singleton-factory";

import "@nomicfoundation/hardhat-verify";
import "@nomiclabs/hardhat-ethers";
import "hardhat-abi-exporter";
import "hardhat-deploy";
import "solidity-docgen";
import "./src/tasks/deploy-anvil";

import {
    Chain,
    arbitrum,
    arbitrumGoerli,
    mainnet,
    optimism,
    optimismGoerli,
    sepolia,
} from "@wagmi/chains";

// read MNEMONIC from env variable
let mnemonic = process.env.MNEMONIC;
let privateKey = process.env.PRIVATE_KEY;

const DEFAULT_DEVNET_MNEMONIC =
    "test test test test test test test test test test test junk";

const ppath = (packageName: string, pathname: string) => {
    return path.join(
        path.dirname(require.resolve(`${packageName}/package.json`)),
        pathname
    );
};

const networkConfig = (chain: Chain): HttpNetworkUserConfig => {
    let url = chain.rpcUrls.public.http.at(0);

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
                ppath(packageName, `/deployments/${network}`)
            ),
        }),
        {}
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
        arbitrum_goerli: networkConfig(arbitrumGoerli),
        arbitrum: networkConfig(arbitrum),
        mainnet: networkConfig(mainnet),
        optimism: networkConfig(optimism),
        optimism_goerli: networkConfig(optimismGoerli),
        sepolia: networkConfig(sepolia),
    },
    external: external(
        [
            "arbitrum",
            "arbitrum_goerli",
            "mainnet",
            "optimism",
            "optimism_goerli",
            "sepolia",
        ],
        ["@cartesi/util", "@cartesi/rollups"]
    ),
    docgen: {
        pages: "files",
    },
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
                `unsupported deterministic deployment for network ${network}`
            );
            return undefined;
        }
    },
};

export default config;
