import {
    AsyncPromptConfig,
    Separator,
    confirm,
    input,
    select,
} from "@inquirer/prompts";
import { CancelablePromise, Context } from "@inquirer/type";
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
import chalk from "chalk";

/**
 * Create an "and" validator from two validators
 * @param v1 first validator function
 * @param v2 second validator function
 * @returns composed validator function using 'and'
 */
const and =
    <T, R>(v1: (value: T) => R, v2?: (value: T) => R) =>
    (value: T) => {
        const r1 = v1(value);
        if (r1 !== true) {
            return r1;
        }
        if (v2) {
            const r2 = v2(value);
            return r2;
        }
        return true;
    };

/**
 * Prompt for an address value.
 * @param config inquirer config
 * @returns address
 */
export type AddressPromptConfig = AsyncPromptConfig & { default?: Address };
export const addressInput = async (
    config: AddressPromptConfig
): Promise<Address> => {
    const address = await input({
        ...config,
        validate: and(
            (value) => isAddress(value) || "Enter a valid address",
            config.validate
        ),
    });
    return getAddress(address);
};

/**
 * Prompt for a hex value.
 * @param config inquirer config
 * @returns hex
 */
export type HexPromptConfig = AsyncPromptConfig & { default?: Hex };
export const hexInput = async (config: HexPromptConfig): Promise<Hex> => {
    const value = await input({
        ...config,
        validate: and(
            (value) => isHex(value) || "Enter a valid hex value",
            config.validate
        ),
    });
    return value as Hex;
};

export type BigintPromptConfig = AsyncPromptConfig & {
    decimals: number;
    default?: bigint;
};
export const bigintInput = async (
    config: BigintPromptConfig
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
export const bytesInput = async (config: AsyncPromptConfig): Promise<Hex> => {
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
        case "hex":
            const valueHex = await hexInput({
                ...config,
                message: `${config.message} (as hex-string)`,
            });
            return valueHex as `0x${string}`;
        case "string":
            const valueString = await input({
                ...config,
                message: `${config.message} (as string)`,
            });
            return stringToHex(valueString);
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
    config: AsyncPromptConfig
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
    const values: any[] = [];
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
                    })
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
                    })
                );
                break;
            default:
                throw new Error(`Unsupported type ${param.type}`);
        }
    }
    return encodeAbiParameters(abiParameters, values);
};

// types below should be exported by @inquirer/select
export type Choice<Value> = {
    value: Value;
    name?: string;
    description?: string;
    disabled?: boolean | string;
    type?: never;
};

export type SelectConfig<Value> = AsyncPromptConfig & {
    choices: ReadonlyArray<Choice<Value> | Separator>;
    pageSize?: number;
};

export const selectAuto = <Value extends unknown>(
    config: SelectConfig<Value> & { discardDisabled?: boolean },
    context?: Context | undefined
): CancelablePromise<Value> => {
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
                    choice.name || choice.value
                )}\n`
            );
            return new CancelablePromise<Value>((resolve) =>
                resolve(choice.value)
            );
        }
    }
    return select(config, context);
};
