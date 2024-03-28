import input from "@inquirer/input";
import { Option } from "clipanion";
import { Address, PublicClient, WalletClient, parseEther } from "viem";

import { etherPortalAbi, etherPortalAddress } from "../../contracts.js";
import { isHex } from "../../flags.js";
import { SendBaseCommand } from "./index.js";

export default class SendEther extends SendBaseCommand {
    static summary = "Send ether deposit to the application.";

    static description =
        "Sends ether deposits to the application, optionally in interactive mode.";

    amount = Option.String("--amount", { description: "amount, in ETH units" });

    execLayerData = Option.String("--execLayerData", {
        description: "exec layer data",
        validator: isHex,
    });

    public async send(
        publicClient: PublicClient,
        walletClient: WalletClient,
    ): Promise<Address> {
        // get dapp address from local node, or ask
        const applicationAddress = await super.getApplicationAddress();

        const amount = this.amount || (await input({ message: "Amount" }));

        const { request } = await publicClient.simulateContract({
            address: etherPortalAddress,
            abi: etherPortalAbi,
            functionName: "depositEther",
            args: [applicationAddress, this.execLayerData ?? "0x"],
            value: parseEther(amount as `${number}`),
            account: walletClient.account,
        });

        return walletClient.writeContract(request);
    }
}
