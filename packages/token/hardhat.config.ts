import { HttpNetworkUserConfig } from "hardhat/types";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";

// read MNEMONIC from env variable
let mnemonic = process.env.MNEMONIC;

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

const config: HardhatUserConfig = {
    solidity: "0.8.20",
    networks: {
        hardhat: mnemonic ? { accounts: { mnemonic } } : {},
        localhost: {
            url: process.env.RPC_URL || "http://localhost:8545",
            accounts: mnemonic ? { mnemonic } : undefined,
        },
        goerli: infuraNetwork("goerli", 5, 6283185),
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
    namedAccounts: {
        deployer: 0,
    },
};

export default config;
