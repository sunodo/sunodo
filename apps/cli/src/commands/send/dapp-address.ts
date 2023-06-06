import { Address } from "abitype";
import { PublicClient, WalletClient } from "viem";

import {
    dAppAddressRelayABI,
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
        walletClient: WalletClient
    ): Promise<Address> {
        // get dapp address from local node, or ask
        const dapp = await super.getDAppAddress();

        const chainId = await publicClient.getChainId();
        const addresses: Record<number, Address> = dAppAddressRelayAddress;
        const address = addresses[chainId] as Address;

        const { request } = await publicClient.simulateContract({
            address,
            abi: dAppAddressRelayABI,
            functionName: "relayDAppAddress",
            args: [dapp],
            account: walletClient.account,
        });

        return walletClient.writeContract(request);
    }
}
