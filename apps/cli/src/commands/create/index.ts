import { Command, Flags, Interfaces } from "@oclif/core";
import { PublicClient, WalletClient } from "viem";

import { SunodoCommand } from "../../sunodoCommand.js";
import createClients, { supportedChains } from "../../wallet.js";

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<
    (typeof CreateBaseCommand)["baseFlags"] & T["flags"]
>;
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T["args"]>;

// base command for sending input to the application
export abstract class CreateBaseCommand<
    T extends typeof Command,
> extends SunodoCommand<typeof CreateBaseCommand> {
    static baseFlags = {
        "chain-id": Flags.integer({
            description: "The EIP-155 chain ID.",
            char: "c",
            env: "CHAIN",
            helpGroup: "Ethereum",
            options: supportedChains({ includeDevnet: true }).map((c) =>
                c.id.toString(),
            ),
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

    protected async connect(): Promise<{
        publicClient: PublicClient;
        walletClient: WalletClient;
    }> {
        // create viem clients
        return createClients({
            chain: supportedChains({ includeDevnet: true }).find(
                (c) => c.id == this.flags["chain-id"],
            ),
            rpcUrl: this.flags["rpc-url"],
            mnemonicPassphrase: this.flags["mnemonic-passphrase"],
            mnemonicIndex: this.flags["mnemonic-index"],
        });
    }

    public async init(): Promise<void> {
        await super.init();
        const { args, flags } = await this.parse({
            flags: this.ctor.flags,
            baseFlags: (super.ctor as typeof CreateBaseCommand).baseFlags,
            args: this.ctor.args,
            enableJsonFlag: this.ctor.enableJsonFlag,
            strict: this.ctor.strict,
        });
        this.flags = flags as Flags<T>;
        this.args = args as Args<T>;
    }
}
