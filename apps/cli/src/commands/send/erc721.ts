import { Address } from "abitype";
import { isAddress, PublicClient, WalletClient } from "viem";
import { input } from "@inquirer/prompts";

import {
    erc721ABI,
    erc721PortalABI,
    erc721PortalAddress,
} from "../../contracts.js";
import { SendBaseCommand } from "./index.js";
import * as CustomFlags from "../../flags.js";

type ERC721Token = {
    name: string;
    symbol: string;
};

export default class SendERC721 extends SendBaseCommand<typeof SendERC721> {
    static summary = "Send ERC-721 deposit to the application.";

    static description =
        "Sends ERC-721 deposits to the application, optionally in interactive mode.";

    static flags = {
        token: CustomFlags.address({ description: "token address" }),
        tokenId: CustomFlags.bigint({ description: "token ID" }),
    };

    static examples = ["<%= config.bin %> <%= command.id %>"];

    private async readToken(
        publicClient: PublicClient,
        address: Address
    ): Promise<ERC721Token> {
        const args = { abi: erc721ABI, address };
        const symbol = await publicClient.readContract({
            ...args,
            functionName: "symbol",
        });
        const name = await publicClient.readContract({
            ...args,
            functionName: "name",
        });
        return {
            name,
            symbol,
        };
    }

    public async send(
        publicClient: PublicClient,
        walletClient: WalletClient
    ): Promise<Address> {
        // get dapp address from local node, or ask
        const dapp = await super.getDAppAddress();

        const ercValidator = async (
            value: string
        ): Promise<string | boolean> => {
            if (!isAddress(value)) {
                return "Invalid address";
            }
            try {
                await this.readToken(publicClient, value);
            } catch (e) {
                return "Invalid token";
            }
            return true;
        };

        const token =
            this.flags.token ||
            ((await input({
                message: "Token address",
                validate: ercValidator,
            })) as Address);

        const tokenId =
            this.flags.tokenId ||
            (await input({
                message: "Token ID",
                validate: (value) => {
                    try {
                        BigInt(value);
                        return true;
                    } catch (e) {
                        return "Invalid number";
                    }
                },
            }));

        const { request } = await publicClient.simulateContract({
            address: erc721PortalAddress,
            abi: erc721PortalABI,
            functionName: "depositERC721Token",
            args: [token, dapp, BigInt(tokenId), "0x", "0x"],
            account: walletClient.account,
        });
        // XXX: add support for baseLayerData and execLayerData

        return walletClient.writeContract(request);
    }
}
