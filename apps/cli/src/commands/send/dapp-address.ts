import { Address, PublicClient, WalletClient } from "viem";

import {
    dAppAddressRelayAbi,
    dAppAddressRelayAddress,
} from "../../contracts.js";
import { SendBaseCommand } from "./index.js";

export default class SendAddress extends SendBaseCommand<typeof SendAddress> {
    static summary = "Send DApp address input to the application.";

    static description =
        "Sends an input to the application with its own address.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    public async send(
        publicClient: PublicClient,
        walletClient: WalletClient,
    ): Promise<Address> {
        // get dapp address from local node, or ask
        const address = await super.getApplicationAddress();

        const { request } = await publicClient.simulateContract({
            address: dAppAddressRelayAddress,
            abi: dAppAddressRelayAbi,
            functionName: "relayDAppAddress",
            args: [address],
            account: walletClient.account,
        });

        return walletClient.writeContract(request);
    }
}
