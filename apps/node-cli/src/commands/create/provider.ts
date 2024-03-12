import { Flags } from "@oclif/core";
import chalk from "chalk";
import ora from "ora";
import { Address, erc20Abi, getContract, parseUnits } from "viem";

import { marketplaceAbi, marketplaceAddress } from "../../contracts.js";
import * as CustomFlags from "../../flags.js";
import { addressInput, bigintInput } from "../../prompts.js";
import { CreateBaseCommand } from "./index.js";

export default class CreateProvider extends CreateBaseCommand<
    typeof CreateProvider
> {
    static description =
        "Create a ValidatorNodeProvider or ReaderNodeProvider smart contract required to run a sunodo node on a live network.";

    static enableJsonFlag = true;

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = {
        consensus: CustomFlags.address({
            description: "consensus (authority)",
            summary:
                "address of the Authority smart contract which will be used as consensus implementation",
        }),
        payee: CustomFlags.address({
            description: "payee",
            summary: "address of recipient of provider payments",
        }),
        price: Flags.string({
            description: "price",
            summary: "price of the ValidatorNodeProvider",
        }),
        token: CustomFlags.address({
            description: "token",
            summary:
                "address of Token used as payment method of the ValidatorNodeProvider",
        }),
    };

    static summary = "Create NodeProvider.";

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
            abi: erc20Abi,
            address: tokenAddress,
            client: {
                public: publicClient,
                wallet: walletClient,
            },
        });

        const symbol = await token.read.symbol();
        const decimals = await token.read.decimals();

        const price = this.flags.price
            ? parseUnits(this.flags.price, decimals)
            : await bigintInput({
                  decimals,
                  message: `Price (${symbol}/second)`,
              });

        const payee =
            this.flags.payee || (await addressInput({ message: "Payee" }));

        // build the transaction
        const { request } = await publicClient.simulateContract({
            abi: marketplaceAbi,
            account: walletClient.account,
            address: marketplaceAddress,
            args: [consensus, token.address, payee, price],
            functionName: "newValidatorNodeProvider",
        });

        // send the transaction
        const hash = await walletClient.writeContract(request);

        // wait for mining
        const progress = ora({
            isSilent: this.jsonEnabled(),
            text: "Sending transaction...",
        }).start();
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        progress.succeed(`Transaction sent: ${hash}`);

        // read authority and history address from events
        const [event] = await publicClient.getContractEvents({
            abi: marketplaceAbi,
            blockHash: receipt.blockHash,
            eventName: "ValidatorNodeProviderCreated",
        });

        const { provider } = event.args;

        if (!provider) {
            throw new Error("ValidatorNodeProvider contract not found");
        }

        this.log(`ValidatorNodeProvider: ${chalk.cyan(provider)}`);
        return { ValidatorNodeProvider: provider };
    }
}
