import * as t from "typanion";
import {
    Address,
    Hex,
    isAddress as viemIsAddress,
    isHex as viemIsHex,
} from "viem";

// validator for Address
export const isAddress = t.makeValidator<unknown, Address>({
    test: (value, state): value is Address => {
        if (typeof value !== "string" || !viemIsAddress(value)) {
            state?.errors?.push(`Expected an address, but received ${value}`);
            return false;
        }
        return true;
    },
});

// TODO: validator for BigInt

// validator for Hex
export const isHex = t.makeValidator<unknown, Hex>({
    test: (value, state): value is Hex => {
        if (!viemIsHex(value)) {
            state?.errors?.push(`Expected a hex string, but received ${value}`);
            return false;
        }
        return true;
    },
});

export const isPort = t.cascade(t.isNumber(), [
    t.isInteger(),
    t.isInInclusiveRange(1, 65535),
]);

export const isPositiveNumber = t.cascade(t.isNumber(), [t.isPositive()]);
