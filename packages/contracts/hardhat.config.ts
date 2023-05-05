import path from "path";
import { HardhatUserConfig } from "hardhat/config";
import { HttpNetworkUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "hardhat-abi-exporter";
import "hardhat-deploy";
import "solidity-docgen";

// read MNEMONIC from env variable
let mnemonic = process.env.MNEMONIC;
const DEFAULT_DEVNET_MNEMONIC =
    "test test test test test test test test test test test junk";

const ppath = (packageName: string, pathname: string) => {
    return path.join(
        path.dirname(require.resolve(`${packageName}/package.json`)),
        pathname
    );
};

const infuraNetwork = (
    network: string,
    chainId?: number,
    gas?: number
): HttpNetworkUserConfig => {
    return {
        url: `https://${network}.infura.io/v3/${process.env.PROJECT_ID}`,
        chainId,
        gas,
        accounts: mnemonic ? { mnemonic } : undefined,
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
    solidity: "0.8.20",
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
        mainnet: infuraNetwork("mainnet", 1, 6283185),
        sepolia: infuraNetwork("sepolia", 11155111, 6283185),
        polygon_mumbai: infuraNetwork("polygon-mumbai", 80001),
        arbitrum_goerli: infuraNetwork("arbitrum-goerli", 421613),
        optimism_goerli: infuraNetwork("optimism-goerli", 420),
        bsc_testnet: {
            url: "https://data-seed-prebsc-1-s1.binance.org:8545",
            chainId: 97,
            accounts: mnemonic ? { mnemonic } : undefined,
        },
        iotex_testnet: {
            url: "https://babel-api.testnet.iotex.io",
            chainId: 4690,
            accounts: mnemonic ? { mnemonic } : undefined,
        },
        chiado: {
            url: "https://rpc.chiadochain.net",
            chainId: 10200,
            gasPrice: 1000000000,
            accounts: mnemonic ? { mnemonic } : undefined,
        },
    },
    external: external(
        [
            "mainnet",
            "sepolia",
            "polygon_mumbai",
            "arbitrum_goerli",
            "optimism_goerli",
            "bsc_testnet",
            "iotex_testnet",
            "chiado",
        ],
        ["@cartesi/util", "@cartesi/rollups"]
    ),
    docgen: {
        pages: "files",
    },
    namedAccounts: {
        deployer: 0,
    },
};

export default config;
