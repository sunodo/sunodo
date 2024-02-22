import { PromptConfig, Separator, input, select } from "@inquirer/prompts";
import { CancelablePromise, Context } from "@inquirer/type";
import chalk from "chalk";
import {
    Address,
    Hex,
    formatUnits,
    getAddress,
    isAddress,
    isHex,
    parseUnits,
} from "viem";

/**
 * Prompt for an address value.
 * @param config inquirer config
 * @returns address
 */
export type AddressPromptConfig = PromptConfig<{ default?: Address }>;
export const addressInput = async (
    config: AddressPromptConfig,
): Promise<Address> => {
    const address = await input({
        ...config,
        validate: (value) => isAddress(value) || "Enter a valid address",
    });
    return getAddress(address);
};

/**
 * Prompt for a hex value.
 * @param config inquirer config
 * @returns hex
 */
export type HexPromptConfig = PromptConfig<{ default?: Hex }>;
export const hexInput = async (config: HexPromptConfig): Promise<Hex> => {
    const value = await input({
        ...config,
        validate: (value) => isHex(value) || "Enter a valid hex value",
    });
    return value as Hex;
};

export type BigintPromptConfig = PromptConfig<{
    decimals: number;
    default?: bigint;
}>;
export const bigintInput = async (
    config: BigintPromptConfig,
): Promise<bigint> => {
    const defaultValue =
        config.default === undefined
            ? undefined
            : formatUnits(config.default, config.decimals);
    const value = await input({
        ...config,
        default: defaultValue,
    });
    return parseUnits(value, config.decimals);
};

// types below should be exported by @inquirer/select
export type Choice<Value> = {
    description?: string;
    disabled?: boolean | string;
    name?: string;
    type?: never;
    value: Value;
};

export type SelectConfig<Value> = PromptConfig<{
    choices: ReadonlyArray<Choice<Value> | Separator>;
    pageSize?: number;
}>;

export const selectAuto = <Value>(
    config: SelectConfig<Value> & { discardDisabled?: boolean },
    context?: Context | undefined,
): CancelablePromise<Value> => {
    const { choices } = config;

    const list = config.discardDisabled
        ? choices.filter((c) => c.type !== "separator" && !c.disabled)
        : choices;

    if (list.length === 1) {
        const choice = list[0];
        if (choice.type !== "separator") {
            const output = context?.output || process.stdout;
            const prefix = chalk.green("?");
            const message: string = chalk.bold(config.message);
            output.write(
                `${prefix} ${message} ${chalk.cyan(
                    choice.name || choice.value,
                )}\n`,
            );
            return new CancelablePromise<Value>((resolve) =>
                resolve(choice.value),
            );
        }
    }

    return select(config, context);
};
