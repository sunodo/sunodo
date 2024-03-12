import { Command, Flags, Interfaces } from "@oclif/core";
import { PublicClient, WalletClient } from "viem";

import * as CustomFlags from "../../flags.js";
import createClients, { supportedChains } from "../../wallet.js";

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<
    (typeof CreateBaseCommand)["baseFlags"] & T["flags"]
>;
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T["args"]>;

// base command for sending input to the application
export abstract class CreateBaseCommand<
    T extends typeof Command,
> extends Command {
    static baseFlags = {
        "chain-id": Flags.integer({
            char: "c",
            description: "The EIP-155 chain ID.",
            env: "CHAIN",
            helpGroup: "Ethereum",
            options: supportedChains({ includeDevnet: true }).map((c) =>
                c.id.toString(),
            ),
        }),
        "mnemonic-index": Flags.integer({
            default: 0,
            description: "Use the private key from the given mnemonic index.",
            helpGroup: "Wallet",
        }),
        "mnemonic-passphrase": Flags.string({
            description: "Use a BIP39 passphrase for the mnemonic.",
            exclusive: ["private-key"],
            helpGroup: "Wallet",
        }),
        "private-key": CustomFlags.hex({
            description: "Use the given private key.",
            exclusive: ["mnemonic-passphrase"],
            helpGroup: "Wallet",
        }),
        "rpc-url": Flags.string({
            char: "r",
            description: "The RPC endpoint.",
            env: "ETH_RPC_URL",
            helpGroup: "Ethereum",
        }),
    };

    protected args!: Args<T>;
    protected flags!: Flags<T>;

    protected async connect(): Promise<{
        publicClient: PublicClient;
        walletClient: WalletClient;
    }> {
        // create viem clients
        return createClients({
            chain: supportedChains({ includeDevnet: true }).find(
                (c) => c.id === this.flags["chain-id"],
            ),
            mnemonicIndex: this.flags["mnemonic-index"],
            mnemonicPassphrase: this.flags["mnemonic-passphrase"],
            privateKey: this.flags["private-key"],
            rpcUrl: this.flags["rpc-url"],
        });
    }

    public async init(): Promise<void> {
        await super.init();
        const { args, flags } = await this.parse({
            args: this.ctor.args,
            baseFlags: (super.ctor as typeof CreateBaseCommand).baseFlags,
            enableJsonFlag: this.ctor.enableJsonFlag,
            flags: this.ctor.flags,
            strict: this.ctor.strict,
        });
        this.flags = flags as Flags<T>;
        this.args = args as Args<T>;
    }
}
