import confirm from "@inquirer/confirm";
import { Separator } from "@inquirer/core";
import input from "@inquirer/input";
import select from "@inquirer/select";
import { CancelablePromise, Context } from "@inquirer/type";
import chalk from "chalk";
import {
    Address,
    Hex,
    encodeAbiParameters,
    formatUnits,
    getAddress,
    isAddress,
    isHex,
    parseAbiParameters,
    parseUnits,
    stringToHex,
} from "viem";

type InputConfig = Parameters<typeof input>[0];
type SelectConfig<ValueType> = Parameters<typeof select<ValueType>>[0];

/**
 * Prompt for an address value.
 * @param config inquirer config
 * @returns address
 */
export type AddressPromptConfig = InputConfig & { default?: Address };
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
export type HexPromptConfig = InputConfig & { default?: Hex };
export const hexInput = async (config: HexPromptConfig): Promise<Hex> => {
    const value = await input({
        ...config,
        validate: (value) => isHex(value) || "Enter a valid hex value",
    });
    return value as Hex;
};

export type BigintPromptConfig = InputConfig & {
    decimals: number;
    default?: bigint;
};
export const bigintInput = async (
    config: BigintPromptConfig,
): Promise<bigint> => {
    const defaultValue =
        config.default != undefined
            ? formatUnits(config.default, config.decimals)
            : undefined;
    const value = await input({
        ...config,
        default: defaultValue,
    });
    return parseUnits(value, config.decimals);
};

/**
 * Prompt for a bytes input, by choosing from different encoding options.
 * @param config inquirer config
 * @returns bytes as hex string
 */
export const bytesInput = async (
    config: InputConfig & { message: string },
): Promise<Hex> => {
    const encoding = await select({
        ...config,
        choices: [
            {
                value: "string",
                name: "String encoding",
                description: "Convert UTF-8 string to bytes",
            },
            {
                value: "hex",
                name: "Hex string encoding",
                description:
                    "Convert a hex string to bytes (must start with 0x)",
            },
            {
                value: "abi",
                name: "ABI encoding",
                description:
                    "Input as ABI encoding parameters https://abitype.dev/api/human.html#parseabiparameters",
            },
        ],
    });
    switch (encoding) {
        case "hex": {
            const valueHex = await hexInput({
                ...config,
                default: "0x",
                message: `${config.message} (as hex-string)`,
            });
            return valueHex as `0x${string}`;
        }

        case "string": {
            const valueString = await input({
                ...config,
                message: `${config.message} (as string)`,
            });
            return stringToHex(valueString);
        }

        case "abi":
            return await abiParamsInput(config);
        default:
            throw new Error(`Unsupported encoding ${encoding}`);
    }
};

/**
 * Prompt for ABI encoded parameters.
 * @param config inquirer config
 * @returns ABI encoded parameters as hex string
 */
export const abiParamsInput = async (
    config: InputConfig & { message: string },
): Promise<`0x${string}`> => {
    const encoding = await input({
        message: `${config.message} (as ABI encoded https://abitype.dev/api/human.html#parseabiparameters )`,
        validate: (value) => {
            try {
                parseAbiParameters(value);
                return true;
            } catch (e) {
                return "Invalid ABI parameters";
            }
        },
    });
    const abiParameters = parseAbiParameters(encoding);
    const values = [];
    for (const param of abiParameters) {
        const message = `${config.message} -> ${param.type} ${
            param.name ?? ""
        }`;
        switch (param.type) {
            case "string":
                values.push(await input({ message }));
                break;
            case "bool":
                values.push(await confirm({ message }));
                break;
            case "uint":
            case "uint8":
            case "uint16":
            case "uint32":
            case "uint64":
            case "uint128":
            case "uint256":
                values.push(
                    await input({
                        message,
                        validate: (value) => {
                            try {
                                BigInt(value);
                                return true;
                            } catch (e) {
                                return "Invalid number";
                            }
                        },
                    }),
                );
                break;
            case "bytes":
                values.push(await bytesInput({ message }));
                break;
            case "address":
                values.push(
                    await input({
                        message,
                        validate: (value) =>
                            isAddress(value) || "Invalid address",
                    }),
                );
                break;
            default:
                throw new Error(`Unsupported type ${param.type}`);
        }
    }
    return encodeAbiParameters(abiParameters, values);
};

// types below should be exported by @inquirer/select
export type Choice<ValueType> = {
    value: ValueType;
    name?: string;
    description?: string;
    disabled?: boolean | string;
    type?: never;
};

export type SelectAutoConfig<ValueType> = SelectConfig<ValueType> & {
    choices: ReadonlyArray<Choice<ValueType> | Separator>;
    pageSize?: number;
};

export const selectAuto = <ValueType>(
    config: SelectAutoConfig<ValueType> & { discardDisabled?: boolean },
    context?: Context | undefined,
): CancelablePromise<ValueType> => {
    const choices = config.choices;

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
            return new CancelablePromise<ValueType>((resolve) =>
                resolve(choice.value),
            );
        }
    }
    return select(config, context);
};
