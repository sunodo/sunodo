import chalk from "chalk";
import ora from "ora";

import {
    authorityFactoryABI,
    authorityHistoryPairFactoryABI,
    authorityHistoryPairFactoryAddress,
    historyFactoryABI,
} from "../../contracts.js";
import { CreateBaseCommand } from "./index.js";
import * as CustomFlags from "../../flags.js";
import { addressInput } from "../../prompts.js";
import { Address } from "viem";

export default class CreateAuthority extends CreateBaseCommand<
    typeof CreateAuthority
> {
    static summary = "Create Authority and History.";

    static description =
        "Create Authority and History smart contracts required to run a sunodo node on a live network.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = {
        owner: CustomFlags.address({
            description: "authority owner",
            summary:
                "public address of the account that will be used by the sunodo node",
        }),
    };

    static enableJsonFlag = true;

    public async run(): Promise<{ Authority: Address; History: Address }> {
        // connect to chain
        const { publicClient, walletClient } = await this.connect();

        // ask for authority owner if not specified
        const owner =
            this.flags.owner ||
            (await addressInput({ message: "Authority Owner" }));

        // build the transaction
        const { request } = await publicClient.simulateContract({
            address: authorityHistoryPairFactoryAddress,
            abi: authorityHistoryPairFactoryABI,
            functionName: "newAuthorityHistoryPair",
            args: [owner],
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
        const [authorityEvent] = await publicClient.getContractEvents({
            abi: authorityFactoryABI,
            eventName: "AuthorityCreated",
            blockHash: receipt.blockHash,
        });
        const [historyEvent] = await publicClient.getContractEvents({
            abi: historyFactoryABI,
            eventName: "HistoryCreated",
            blockHash: receipt.blockHash,
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
