import input from "@inquirer/input";
import select from "@inquirer/select";
import { Command, Option } from "clipanion";
import ora from "ora";
import {
    Address,
    PublicClient,
    WalletClient,
    isAddress as viemIsAddress,
} from "viem";

import { isAddress, isPositiveNumber } from "../../flags.js";
import { SunodoCommand } from "../../sunodoCommand.js";
import createClients, { supportedChains } from "../../wallet.js";

// base command for sending input to the application
export abstract class SendBaseCommand extends SunodoCommand {
    dapp = Option.String<Address>("--dapp", {
        description: "dapp address.",
        validator: isAddress,
    });

    chainId = Option.String("-c,--chain-id", {
        description: "The EIP-155 chain ID.",
        validator: isPositiveNumber, // XXX: limited options
        env: "CHAIN",
    });

    rpcUrl = Option.String("-r,--rpc-url", {
        description: "The RPC endpoint.",
        env: "ETH_RPC_URL",
    });
    mnemonicPassphrase = Option.String("--mnemonic-passphrase", {
        description: "Use a BIP39 passphrase for the mnemonic.",
    });

    mnemonicIndex = Option.String("--mnemonic-index", {
        description: "Use the private key from the given mnemonic index.",
        validator: isPositiveNumber,
    });

    private async connect(): Promise<{
        publicClient: PublicClient;
        walletClient: WalletClient;
    }> {
        // create viem clients
        return createClients({
            chain: supportedChains({ includeDevnet: true }).find(
                (c) => c.id == this.chainId,
            ),
            rpcUrl: this.rpcUrl,
            mnemonicPassphrase: this.mnemonicPassphrase,
            mnemonicIndex: this.mnemonicIndex,
        });
    }

    protected async getApplicationAddress(): Promise<Address> {
        if (this.dapp) {
            // honor the flag
            return this.dapp;
        }

        // get the running container dapp address
        const nodeAddress = await super.getApplicationAddress();

        // query for the address
        const applicationAddress = await input({
            message: "Application address",
            validate: (value) => viemIsAddress(value) || "Invalid address",
            default: nodeAddress,
        });

        return applicationAddress as Address;
    }

    protected abstract send(
        publicClient: PublicClient,
        walletClient: WalletClient,
    ): Promise<Address>;

    public async execute(): Promise<void> {
        const { publicClient, walletClient } = await this.connect();
        const hash = await this.send(publicClient, walletClient);
        const progress = ora("Sending input...").start();
        await publicClient.waitForTransactionReceipt({ hash });
        progress.succeed(`Input sent: ${hash}`);
    }
}

export default class Send extends Command {
    static paths = [["send"]];

    static usage = Command.Usage({
        description: "Send input to the application.",
        details:
            "Sends different kinds of input to the application in interactive mode.",
    });

    rest = Option.Rest();

    public async execute(): Promise<void> {
        // get all send sub-commands
        const sendCommands = this.cli.definitions().filter((d) => {
            const paths = d.path.split(" ");
            return paths.length > 2 && paths[1] === "send";
        });

        // select the send sub-command
        const commandId = await select({
            message: "Select send sub-command",
            choices: sendCommands.map((command) => {
                const paths = command.path.split(" ");
                return {
                    value: paths[2],
                    name: command.description,
                    description: command.details,
                };
            }),
        });

        // invoke the sub-command
        await this.cli.run(["send", commandId, ...this.rest]);
    }
}
