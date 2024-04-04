import input from "@inquirer/input";
import { Address, parseEther, PublicClient, WalletClient } from "viem";

import { etherPortalAbi, etherPortalAddress } from "../../contracts.js";
import * as CustomFlags from "../../flags.js";
import { SendBaseCommand } from "./index.js";

export default class SendEther extends SendBaseCommand<typeof SendEther> {
    static summary = "Send ether deposit to the application.";

    static description =
        "Sends ether deposits to the application, optionally in interactive mode.";

    static flags = {
        amount: CustomFlags.number({ description: "amount, in ETH units" }),
        execLayerData: CustomFlags.hex({
            description: "exec layer data",
            default: "0x",
        }),
    };

    static examples = ["<%= config.bin %> <%= command.id %>"];

    public async send(
        publicClient: PublicClient,
        walletClient: WalletClient,
    ): Promise<Address> {
        // get dapp address from local node, or ask
        const applicationAddress = await super.getApplicationAddress();

        const amount =
            this.flags.amount || (await input({ message: "Amount" }));

        const { request } = await publicClient.simulateContract({
            address: etherPortalAddress,
            abi: etherPortalAbi,
            functionName: "depositEther",
            args: [applicationAddress, this.flags.execLayerData],
            value: parseEther(amount as `${number}`),
            account: walletClient.account,
        });

        return walletClient.writeContract(request);
    }
}
