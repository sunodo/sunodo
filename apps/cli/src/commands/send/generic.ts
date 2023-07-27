import { Address, parseAbiParameters } from "abitype";
import {
    encodeAbiParameters,
    getAddress,
    isAddress,
    isHex,
    PublicClient,
    stringToHex,
    WalletClient,
} from "viem";

import { inputBoxABI, inputBoxAddress } from "../../contracts.js";
import { SendBaseCommand } from "./index.js";
import { bytesInput } from "../../prompts.js";
import { Flags } from "@oclif/core";

export default class SendGeneric extends SendBaseCommand<typeof SendGeneric> {
    static summary = "Send generic input to the application.";

    static description =
        "Sends generics inputs to the application, optionally in interactive mode.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = {
        input: Flags.string({
            description: "input payload",
            summary: "see input-encoding for definition on how input is parsed",
        }),
        "input-encoding": Flags.string({
            description: "input encoding",
            summary:
                "if input-encoding is undefined, the input is parsed as a hex-string if it starts with 0x or else is parsed as a UTF-8 encoding",
            options: ["hex", "string", "abi"],
        }),
        "input-abi-params": Flags.string({
            description: "input abi params",
            summary:
                "ABI params definition for input, following human-readable format specified at https://abitype.dev/api/human.html#parseabiparameters",
        }),
    };

    protected async getInput(): Promise<`0x${string}` | undefined> {
        const input = this.flags.input;
        const encoding = this.flags["input-encoding"];
        if (input) {
            if (encoding === "hex") {
                // validate if is a hex value
                if (isHex(input)) {
                    throw new Error("input encoded as hex must start with 0x");
                }
                return input as `0x${string}`;
            } else if (encoding === "string") {
                // encode UTF-8 string as hex
                return stringToHex(input);
            } else if (encoding === "abi") {
                const abiParams = this.flags["input-abi-params"];
                if (!abiParams) {
                    throw new Error("Undefined input-abi-params");
                }
                const abiParameters = parseAbiParameters(abiParams);
                // TODO: decode values
                const values: any[] = input.split(",").map((v, index) => {
                    if (index >= abiParameters.length) {
                        throw new Error(
                            `Too many values, expected ${abiParameters.length} values based on --input-abi-params '${abiParams}', parsing value at index ${index} from input '${input}'`
                        );
                    }
                    const param = abiParameters[index];
                    switch (param.type) {
                        case "string":
                            return v;
                        case "bool":
                            if (v === "true") return true;
                            if (v === "false") return false;
                            throw new Error(`Invalid boolean value: ${v}`);
                        case "uint":
                        case "uint8":
                        case "uint16":
                        case "uint32":
                        case "uint64":
                        case "uint128":
                        case "uint256":
                            try {
                                return BigInt(v);
                            } catch (e) {
                                throw new Error(`Invalid uint value: ${v}`);
                            }
                        case "bytes":
                            if (isHex(v)) {
                                return v as `0x${string}`;
                            }
                            throw new Error(`Invalid bytes value: ${v}`);
                        case "address":
                            if (isAddress(v)) {
                                return getAddress(v);
                            }
                            throw new Error(`Invalid address value: ${v}`);
                        default:
                            throw new Error(`Unsupported type ${param.type}`);
                    }
                });
                if (values.length !== abiParameters.length) {
                    throw new Error(
                        `Not enough values, expected ${abiParameters.length} values based on --input-abi-params '${abiParams}', parsed ${values.length} values from input '${input}'`
                    );
                }
                return encodeAbiParameters(abiParameters, values);
            } else {
                if (isHex(input)) {
                    return input as `0x${string}`;
                } else {
                    // encode UTF-8 string as hex
                    return stringToHex(input);
                }
            }
        }
        return undefined;
    }

    public async send(
        publicClient: PublicClient,
        walletClient: WalletClient
    ): Promise<Address> {
        // get dapp address from local node, or ask
        const dapp = await super.getDAppAddress();

        const payload =
            (await this.getInput()) || (await bytesInput({ message: "Input" }));
        const { request } = await publicClient.simulateContract({
            address: inputBoxAddress,
            abi: inputBoxABI,
            functionName: "addInput",
            args: [dapp, payload],
            account: walletClient.account,
        });

        return walletClient.writeContract(request);
    }
}
