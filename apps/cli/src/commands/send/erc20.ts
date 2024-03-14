import { input } from "@inquirer/prompts";
import { Address } from "abitype";
import {
    erc20Abi,
    isAddress,
    parseEther,
    PublicClient,
    WalletClient,
} from "viem";

import { erc20PortalAbi, erc20PortalAddress } from "../../contracts.js";
import * as CustomFlags from "../../flags.js";
import { SendBaseCommand } from "./index.js";

type ERC20Token = {
    name: string;
    symbol: string;
    decimals: number;
};

export default class SendERC20 extends SendBaseCommand<typeof SendERC20> {
    static summary = "Send ERC-20 deposit to the application.";

    static description =
        "Sends ERC-20 deposits to the application, optionally in interactive mode.";

    static flags = {
        token: CustomFlags.address({ description: "token address" }),
        amount: CustomFlags.number({ description: "amount" }),
    };

    static examples = ["<%= config.bin %> <%= command.id %>"];

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

    private async setAllowance(
            publicClient: PublicClient,
            walletClient: WalletClient,
            amount: bigint,
            tokenAddress: Address) {

        const allowance = await publicClient.readContract({
            address: tokenAddress,
            abi: erc20Abi,  
            functionName: "allowance",
            args: [walletClient.account?.address as `0x${string}`, erc20PortalAddress],
            account: walletClient.account
        }) 
        
    
        if (allowance < amount) {
            const allowanceNeeded = amount - allowance

            const { request } = await publicClient.simulateContract({
                address: tokenAddress,
                abi: erc20Abi,  
                functionName: "approve",
                args: [erc20PortalAddress,  allowanceNeeded],
                account: walletClient.account
            
            }) 

            return await walletClient.writeContract(request)  

        }
    }

    public async send(
        publicClient: PublicClient,
        walletClient: WalletClient,
    ): Promise<Address> {
        // get dapp address from local node, or ask
        const dapp = await super.getDAppAddress();

        const ercValidator = async (
            value: string,
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

        const tokenAddress =
            this.flags.token ||
            ((await input({
                message: "Token address",
                validate: ercValidator,
            })) as Address);

        const amount = parseEther((this.flags.amount || (await input({ message: "Amount" }))) as `${number}`);

        await this.setAllowance(publicClient, walletClient, amount, tokenAddress)

        const { request } = await publicClient.simulateContract({
            address: erc20PortalAddress,
            abi: erc20PortalAbi,
            functionName: "depositERC20Tokens",
            args: [tokenAddress, dapp, amount, "0x"],
            account: walletClient.account,
        });

        return walletClient.writeContract(request);
    }
}
