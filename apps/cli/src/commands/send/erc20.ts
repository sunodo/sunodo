import input from "@inquirer/input";
import { Command, Option } from "clipanion";
import {
    Address,
    PublicClient,
    WalletClient,
    erc20Abi,
    parseEther,
    isAddress as viemIsAddress,
} from "viem";

import { erc20PortalAbi, erc20PortalAddress } from "../../contracts.js";
import { isAddress } from "../../flags.js";
import { SendBaseCommand } from "./index.js";

type ERC20Token = {
    name: string;
    symbol: string;
    decimals: number;
};

export default class SendERC20 extends SendBaseCommand {
    static usage = Command.Usage({
        description: "Send ERC-20 deposit to the application.",
        details:
            "Sends ERC-20 deposits to the application, optionally in interactive mode.",
    });

    token = Option.String("--token", {
        description: "token address",
        validator: isAddress,
    });
    amount = Option.String("--amount", { description: "amount" });

    private async readToken(
        publicClient: PublicClient,
        address: Address,
    ): Promise<ERC20Token> {
        const args = { abi: erc20Abi, address };
        const symbol = await publicClient.readContract({
            ...args,
            functionName: "symbol",
        });
        const name = await publicClient.readContract({
            ...args,
            functionName: "name",
        });
        const decimals = await publicClient.readContract({
            ...args,
            functionName: "decimals",
        });
        return {
            name,
            symbol,
            decimals,
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

        const tokenAddress =
            this.token ||
            ((await input({
                message: "Token address",
                validate: ercValidator,
            })) as Address);

        const amount = this.amount || (await input({ message: "Amount" }));

        const { request } = await publicClient.simulateContract({
            address: erc20PortalAddress,
            abi: erc20PortalAbi,
            functionName: "depositERC20Tokens",
            args: [
                tokenAddress,
                applicationAddress,
                parseEther(amount as `${number}`),
                "0x",
            ],
            account: walletClient.account,
        });

        return walletClient.writeContract(request);
    }
}
