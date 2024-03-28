import input from "@inquirer/input";
import { Command, Option } from "clipanion";
import {
    Address,
    PublicClient,
    WalletClient,
    erc721Abi,
    isAddress as viemIsAddress,
} from "viem";

import { erc721PortalAbi, erc721PortalAddress } from "../../contracts.js";
import { isAddress } from "../../flags.js";
import { SendBaseCommand } from "./index.js";

type ERC721Token = {
    name: string;
    symbol: string;
};

export default class SendERC721 extends SendBaseCommand {
    static usage = Command.Usage({
        description: "Send ERC-721 deposit to the application.",
        details:
            "Sends ERC-721 deposits to the application, optionally in interactive mode.",
    });

    token = Option.String("--token", {
        description: "token address",
        validator: isAddress,
    });

    tokenId = Option.String("--tokenId", { description: "token ID" });

    private async readToken(
        publicClient: PublicClient,
        address: Address,
    ): Promise<ERC721Token> {
        const args = { abi: erc721Abi, address };
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
        walletClient: WalletClient,
    ): Promise<Address> {
        // get dapp address from local node, or ask
        const applicationAddress = await super.getApplicationAddress();

        const ercValidator = async (
            value: string,
        ): Promise<string | boolean> => {
            if (!viemIsAddress(value)) {
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
            this.token ||
            ((await input({
                message: "Token address",
                validate: ercValidator,
            })) as Address);

        const tokenId =
            this.tokenId ||
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
            abi: erc721PortalAbi,
            functionName: "depositERC721Token",
            args: [token, applicationAddress, BigInt(tokenId), "0x", "0x"],
            account: walletClient.account,
        });
        // XXX: add support for baseLayerData and execLayerData

        return walletClient.writeContract(request);
    }
}
