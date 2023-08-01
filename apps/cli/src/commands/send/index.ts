import { Address } from "abitype";
import { Command, Flags, Interfaces } from "@oclif/core";
import { isAddress, PublicClient, WalletClient } from "viem";
import { input, select } from "@inquirer/prompts";
import ora from "ora";

import { SunodoCommand } from "../../sunodoCommand.js";
import * as CustomFlags from "../../flags.js";
import createClients, { chains } from "../../wallet.js";

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<
    (typeof SendBaseCommand)["baseFlags"] & T["flags"]
>;
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T["args"]>;

// base command for sending input to the application
export abstract class SendBaseCommand<
    T extends typeof Command
> extends SunodoCommand<typeof SendBaseCommand> {
    static baseFlags = {
        dapp: CustomFlags.address({
            summary: "dapp address.",
            description:
                "the address of the DApp, defaults to the deployed DApp address if application is running.",
        }),
        chain: CustomFlags.chain({
            description: "The chain name or EIP-155 chain ID.",
            char: "c",
            env: "CHAIN",
            helpGroup: "Ethereum",
            chains,
            options: chains.map((c) => c.network),
        }),
        "rpc-url": Flags.string({
            description: "The RPC endpoint.",
            char: "r",
            env: "ETH_RPC_URL",
            helpGroup: "Ethereum",
        }),
        "mnemonic-passphrase": Flags.string({
            description: "Use a BIP39 passphrase for the mnemonic.",
            helpGroup: "Wallet",
        }),
        "mnemonic-index": Flags.integer({
            description: "Use the private key from the given mnemonic index.",
            helpGroup: "Wallet",
            default: 0,
        }),
    };

    protected flags!: Flags<T>;
    protected args!: Args<T>;

    private async connect(): Promise<{
        publicClient: PublicClient;
        walletClient: WalletClient;
    }> {
        // create viem clients
        return createClients({
            chain: this.flags.chain,
            rpcUrl: this.flags["rpc-url"],
            mnemonicPassphrase: this.flags["mnemonic-passphrase"],
            mnemonicIndex: this.flags["mnemonic-index"],
        });
    }

    protected async getDAppAddress(): Promise<Address> {
        if (this.flags.dapp) {
            // honor the flag
            return this.flags.dapp;
        }

        // get the address book
        const addressBook = await super.getAddressBook();
        const dapp =
            addressBook["CartesiDApp"] ||
            (await input({
                message: "DApp address",
                validate: (value) => isAddress(value) || "Invalid address",
            }));

        return dapp as Address;
    }

    public async init(): Promise<void> {
        await super.init();
        const { args, flags } = await this.parse({
            flags: this.ctor.flags,
            baseFlags: (super.ctor as typeof SendBaseCommand).baseFlags,
            args: this.ctor.args,
            strict: this.ctor.strict,
        });
        this.flags = flags as Flags<T>;
        this.args = args as Args<T>;
    }

    protected abstract send(
        publicClient: PublicClient,
        walletClient: WalletClient
    ): Promise<Address>;

    public async run(): Promise<void> {
        const { publicClient, walletClient } = await this.connect();
        const hash = await this.send(publicClient, walletClient);
        const progress = ora("Sending input...").start();
        await publicClient.waitForTransactionReceipt({ hash });
        progress.succeed(`Input sent: ${hash}`);
    }
}

export default class Send extends Command {
    static summary = "Send input to the application.";

    static description =
        "Sends different kinds of input to the application in interactive mode.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    public async run(): Promise<void> {
        // get all send sub-commands
        const sendCommands = this.config.commands.filter((command) =>
            command.id.startsWith("send:")
        );

        // select the send sub-command
        const commandId = await select({
            message: "Select send sub-command",
            choices: sendCommands.map((command) => ({
                value: command.id,
                name: command.summary,
                description: command.description,
            })),
        });

        // invoke the sub-command
        await this.config.runCommand(commandId, this.argv);
    }
}
