import { AsyncPromptConfig, confirm, input, select } from "@inquirer/prompts";
import {
    encodeAbiParameters,
    isAddress,
    isHex,
    parseAbiParameters,
    stringToHex,
} from "viem";

/**
 * Prompt for a bytes input, by choosing from different encoding options.
 * @param config inquirer config
 * @returns bytes as hex string
 */
export const bytesInput = async (
    config: AsyncPromptConfig
): Promise<`0x${string}`> => {
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
            const valueHex = await input({
                ...config,
                message: `${config.message} (as hex-string)`,
                validate: (value) =>
                    isHex(value) || "Enter a hex-string value starting with 0x",
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
