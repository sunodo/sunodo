import { mergeAbis } from "@ponder/utils";
import { createConfig } from "ponder";
import { isAddress } from "viem";
import { financialProtocolABI, machineProtocolABI } from "./abis";

const BLOCKS_INTERVAL = Number.parseInt(process.env.BLOCKS_INTERVAL ?? "10");
const providerAddress = process.env.PROVIDER_ADDRESS;
if (!providerAddress) {
    throw new Error("PROVIDER_ADDRESS is not set");
}
if (!isAddress(providerAddress)) {
    throw new Error("PROVIDER_ADDRESS is invalid");
}

export default createConfig({
    chains: {
        cartesi: {
            id: 13370,
            rpc: process.env.PONDER_RPC_URL_13370,
        },
        mainnet: {
            id: 1,
            rpc: process.env.PONDER_RPC_URL_1,
        },
    },
    blocks: {
        Applications: {
            chain: "cartesi",
            interval: BLOCKS_INTERVAL,
        },
    },
    contracts: {
        Provider: {
            abi: mergeAbis([machineProtocolABI, financialProtocolABI]),
            chain: "cartesi",
            address: providerAddress,
        },
    },
});
