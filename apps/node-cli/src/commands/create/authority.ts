import chalk from "chalk";
import ora from "ora";
import { Address } from "viem";

import {
    authorityFactoryAbi,
    authorityHistoryPairFactoryAbi,
    authorityHistoryPairFactoryAddress,
    historyFactoryAbi,
} from "../../contracts.js";
import * as CustomFlags from "../../flags.js";
import { addressInput } from "../../prompts.js";
import { CreateBaseCommand } from "./index.js";

export default class CreateAuthority extends CreateBaseCommand<
    typeof CreateAuthority
> {
    static description =
        "Create Authority and History smart contracts required to run a sunodo node on a live network.";

    static enableJsonFlag = true;

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = {
        owner: CustomFlags.address({
            description: "authority owner",
            summary:
                "public address of the account that will be used by the sunodo node",
        }),
    };

    static summary = "Create Authority and History.";

    public async run(): Promise<{ Authority: Address; History: Address }> {
        // connect to chain
        const { publicClient, walletClient } = await this.connect();

        // ask for authority owner if not specified
        const owner =
            this.flags.owner ||
            (await addressInput({
                message: "Authority Owner",
                default: walletClient.account?.address,
            }));

        // build the transaction
        const { request } = await publicClient.simulateContract({
            abi: authorityHistoryPairFactoryAbi,
            account: walletClient.account,
            address: authorityHistoryPairFactoryAddress,
            args: [owner],
            functionName: "newAuthorityHistoryPair",
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
        const [authorityEvent] = await publicClient.getContractEvents({
            abi: authorityFactoryAbi,
            blockHash: receipt.blockHash,
            eventName: "AuthorityCreated",
        });
        const [historyEvent] = await publicClient.getContractEvents({
            abi: historyFactoryAbi,
            blockHash: receipt.blockHash,
            eventName: "HistoryCreated",
        });

        const { authority } = authorityEvent.args;
        const { history } = historyEvent.args;

        if (!authority) {
            throw new Error("Authority contract not found");
        }

        if (!history) {
            throw new Error("History contract not found");
        }

        this.log(`Authority: ${chalk.cyan(authority)}`);
        this.log(`History: ${chalk.cyan(history)}`);
        return { Authority: authority, History: history };
    }
}
