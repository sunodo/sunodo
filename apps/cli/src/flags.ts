import { Flags } from "@oclif/core";
import { Address } from "abitype";
import { isAddress, isHex } from "viem";

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
