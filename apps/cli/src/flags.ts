import { Flags } from "@oclif/core";
import { Chain } from "@wagmi/chains";
import { Address } from "abitype";
import { isAddress, isHex } from "viem";

import { ConsensusType } from "./deploy.js";

// custom flag for Address, does validation
export const address = Flags.custom<Address>({
    parse: async (input) => {
        if (isAddress(input)) {
            return input;
        }
        throw new Error("Invalid address");
    },
});

// custom flag for bigint
export const bigint = Flags.custom<bigint>({
    parse: async (input) => BigInt(input),
});

// custom flag for string number
export const number = Flags.custom<`${number}`>({
    parse: async (input) => input as `${number}`,
});

// custom flag for hex string
export const hex = Flags.custom<`0x${string}`>({
    parse: async (input) => {
        if (isHex(input)) {
            return input;
        }
        throw new Error("Invalid hex string");
    },
});

// flag for chain selection, require a list of supported chains
type ChainOpts = { chains: Chain[] };
export const chain = Flags.custom<Chain, ChainOpts>({
    parse: async (input, _context, { chains }) => {
        const chain = chains.find(
            (c) => c.name === input || c.id === parseInt(input)
        );
        if (!chain) {
            throw new Error(`Invalid chain ${input}`);
        }
        return chain;
    },
});
