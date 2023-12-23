import chalk from "chalk";
import ora from "ora";
import { Address, getContract, parseUnits } from "viem";

import {
    erc20ABI,
    marketplaceABI,
    marketplaceAddress,
} from "../../contracts.js";
import { CreateBaseCommand } from "./index.js";
import * as CustomFlags from "../../flags.js";
import { addressInput, bigintInput } from "../../prompts.js";
import { Flags } from "@oclif/core";

export default class CreateProvider extends CreateBaseCommand<
    typeof CreateProvider
> {
    static summary = "Create NodeProvider.";

    static description =
        "Create a ValidatorNodeProvider or ReaderNodeProvider smart contract required to run a sunodo node on a live network.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = {
        consensus: CustomFlags.address({
            description: "consensus (authority)",
            summary:
                "address of the Authority smart contract which will be used as consensus implementation",
        }),
        token: CustomFlags.address({
            description: "token",
            summary:
                "address of Token used as payment method of the ValidatorNodeProvider",
        }),
        price: Flags.string({
            description: "price",
            summary: "price of the ValidatorNodeProvider",
        }),
        payee: CustomFlags.address({
            description: "payee",
            summary: "address of recipient of provider payments",
        }),
    };

    static enableJsonFlag = true;

    public async run(): Promise<{ ValidatorNodeProvider: Address }> {
        // connect to chain
        const { publicClient, walletClient } = await this.connect();

        // ask for authority owner if not specified
        const consensus =
            this.flags.consensus ||
            (await addressInput({ message: "Consensus (Authority)" }));

        const tokenAddress =
            this.flags.token ||
            (await addressInput({ message: "Token address" }));

        // instantiate token contract
        const token = getContract({
            abi: erc20ABI,
            address: tokenAddress,
            publicClient,
            walletClient,
        });

        const symbol = await token.read.symbol();
        const decimals = await token.read.decimals();

        const price = this.flags.price
            ? parseUnits(this.flags.price, decimals)
            : await bigintInput({
                  message: `Price (${symbol}/second)`,
                  decimals: decimals,
              });

        const payee =
            this.flags.payee || (await addressInput({ message: "Payee" }));

        // build the transaction
        const { request } = await publicClient.simulateContract({
            address: marketplaceAddress,
            abi: marketplaceABI,
            functionName: "newValidatorNodeProvider",
            args: [consensus, token.address, payee, price],
            account: walletClient.account,
        });

        // send the transaction
        const hash = await walletClient.writeContract(request);

        // wait for mining
        const progress = ora({
            text: "Sending transaction...",
            isSilent: this.jsonEnabled(),
        }).start();
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        progress.succeed(`Transaction sent: ${hash}`);

        // read authority and history address from events
        const [event] = await publicClient.getContractEvents({
            abi: marketplaceABI,
            eventName: "ValidatorNodeProviderCreated",
            blockHash: receipt.blockHash,
        });

        const { provider } = event.args;

        if (!provider) {
            throw new Error("ValidatorNodeProvider contract not found");
        }

        this.log(`ValidatorNodeProvider: ${chalk.cyan(provider)}`);
        return { ValidatorNodeProvider: provider };
    }
}
