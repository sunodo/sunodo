import { Command, Option } from "clipanion";
import {
    Address,
    PublicClient,
    WalletClient,
    encodeAbiParameters,
    getAddress,
    isAddress,
    isHex,
    parseAbiParameters,
    stringToHex,
} from "viem";

import { inputBoxAbi, inputBoxAddress } from "../../contracts.js";
import { bytesInput } from "../../prompts.js";
import { SendBaseCommand } from "./index.js";

export default class SendGeneric extends SendBaseCommand {
    static usage = Command.Usage({
        description: "Send generic input to the application.",
        details:
            "Sends generics inputs to the application, optionally in interactive mode.",
    });

    input = Option.String("--input", {
        description: "input payload",
    });

    inputEncoding = Option.String("--input-encoding", {
        description: "input encoding",
        // options: ["hex", "string", "abi"],
    });

    inputAbiParams = Option.String("--input-abi-params", {
        description: "input abi params",
    });

    protected async getInput(): Promise<`0x${string}` | undefined> {
        const input = this.input;
        const encoding = this.inputEncoding;
        if (input) {
            if (encoding === "hex") {
                // validate if is a hex value
                if (!isHex(input)) {
                    throw new Error("input encoded as hex must start with 0x");
                }
                return input as `0x${string}`;
            } else if (encoding === "string") {
                // encode UTF-8 string as hex
                return stringToHex(input);
            } else if (encoding === "abi") {
                const abiParams = this.inputAbiParams;
                if (!abiParams) {
                    throw new Error("Undefined input-abi-params");
                }
                const abiParameters = parseAbiParameters(abiParams);
                // TODO: decode values
                const values = input.split(",").map((v, index) => {
                    if (index >= abiParameters.length) {
                        throw new Error(
                            `Too many values, expected ${abiParameters.length} values based on --input-abi-params '${abiParams}', parsing value at index ${index} from input '${input}'`,
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
                        `Not enough values, expected ${abiParameters.length} values based on --input-abi-params '${abiParams}', parsed ${values.length} values from input '${input}'`,
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
        walletClient: WalletClient,
    ): Promise<Address> {
        // get dapp address from local node, or ask
        const applicationAddress = await super.getApplicationAddress();

        const payload =
            (await this.getInput()) || (await bytesInput({ message: "Input" }));
        const { request } = await publicClient.simulateContract({
            address: inputBoxAddress,
            abi: inputBoxAbi,
            functionName: "addInput",
            args: [applicationAddress, payload],
            account: walletClient.account,
        });

        return walletClient.writeContract(request);
    }
}
