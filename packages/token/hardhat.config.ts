import { HttpNetworkUserConfig } from "hardhat/types";
import { HardhatUserConfig } from "hardhat/config";
import { getSingletonFactoryInfo } from "@safe-global/safe-singleton-factory";

import "hardhat-deploy";

import {
    Chain,
    arbitrum,
    arbitrumSepolia,
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

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.20",
        settings: { evmVersion: "paris" },
    },
    networks: {
        hardhat: mnemonic ? { accounts: { mnemonic } } : {},
        localhost: {
            url: process.env.RPC_URL || "http://localhost:8545",
            accounts: mnemonic
                ? { mnemonic }
                : privateKey
                  ? [privateKey]
                  : {
                        mnemonic: DEFAULT_DEVNET_MNEMONIC,
                    },
        },
        arbitrum_sepolia: networkConfig(arbitrumSepolia),
        arbitrum: networkConfig(arbitrum),
        mainnet: networkConfig(mainnet),
        optimism: networkConfig(optimism),
        optimism_sepolia: networkConfig(optimismSepolia),
        sepolia: networkConfig(sepolia),
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
                `unsupported deterministic deployment for network ${network}`,
            );
            return undefined;
        }
    },
};

export default config;
