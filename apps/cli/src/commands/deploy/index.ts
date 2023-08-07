import { Args, Command, Flags, Interfaces } from "@oclif/core";
import { Address, Chain, Hash } from "viem";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { URL } from "url";

import { SunodoCommand } from "../../sunodoCommand.js";
import deploy from "../../deploy.js";
import * as CustomFlags from "../../flags.js";
import { chains } from "../../wallet.js";

export type Deployment = {
    chainId: number; // id of chain where the application was deployed
    transaction: Hash; // hash of the transaction that deployed the application
    address: Address; // address of the deployed application
    owner: Address; // address of the application owner
    factory: Address; // address of the factory smart contract
    templateHash: Hash; // hash of the cartesi machine template
    location: string; // public location of the cartesi machine template
};

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<
    (typeof DeployBaseCommand)["baseFlags"] & T["flags"]
>;
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T["args"]>;

// base command for sending input to the application
export abstract class DeployBaseCommand<
    T extends typeof Command,
> extends SunodoCommand<typeof DeployBaseCommand> {
    static baseFlags = {};

    protected flags!: Flags<T>;
    protected args!: Args<T>;

    protected getDeployments(): Deployment[] {
        const filename = path.join(".sunodo", "deployments.json");
        return fs.existsSync(filename)
            ? (fs.readJsonSync(filename) as Deployment[])
            : [];
    }

    protected saveDeployment(deployment: Deployment) {
        const deployments = this.getDeployments();
        deployments.push(deployment);
        const filename = path.join(".sunodo", "deployments.json");
        fs.outputJsonSync(filename, deployments);
    }

    public async init(): Promise<void> {
        await super.init();
        const { args, flags } = await this.parse({
            flags: this.ctor.flags,
            baseFlags: (super.ctor as typeof DeployBaseCommand).baseFlags,
            args: this.ctor.args,
            strict: this.ctor.strict,
        });
        this.flags = flags as Flags<T>;
        this.args = args as Args<T>;
    }
}

export default class Deploy extends DeployBaseCommand<typeof Deploy> {
    static summary = "Deploy application to a live network.";

    static description =
        "Package, upload and deploy the application to a supported network.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static networkFlags = {
        network: CustomFlags.chain({
            summary: "network to deploy to",
            options: chains.map((c) => c.network),
            chains,
        }),
    };

    static walletFlags = {
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

    static ipfsFlags = {
        "ipfs-url": Flags.url({
            summary:
                "address of IPFS node to upload the cartesi machine snapshot",
            helpGroup: "IPFS",
        }),
        "ipfs-username": Flags.string({
            summay: "username for IPFS node",
            helpGroup: "IPFS",
        }),
        "ipfs-password": Flags.string({
            summary: "password for IPFS node",
            helpGroup: "IPFS",
        }),
    };

    static flags = {
        dev: Flags.boolean({
            summary: "developer mode",
            description:
                "enable options related to local development environment",
            hidden: true,
        }),
        ...this.networkFlags,
        ...this.walletFlags,
        ...this.ipfsFlags,
        owner: CustomFlags.address({
            summary: "address of owner of the application",
            description:
                "the application owner has the power to change the consensus at any time",
        }),
        factory: CustomFlags.address({
            summary: "address of dapp factory",
            description:
                "A factory is already associated with a consensus and a payment method",
        }),
        webapp: Flags.url({
            description: "address of sunodo webapp",
            default: new URL("https://app.sunodo.io/deploy"),
            hidden: true,
        }),
    };

    public async run(): Promise<void> {
        const { flags } = await this.parse(Deploy);

        const snapshot = path.join(".sunodo", "image");
        const deployment = await deploy(snapshot, {
            ipfs: {
                url: flags["ipfs-url"],
                username: flags["ipfs-username"],
                password: flags["ipfs-password"],
            },
            network: {
                dev: flags.dev,
                chain: flags.network,
                mnemonicPassphrase: flags["mnemonic-passphrase"],
                mnemonicIndex: flags["mnemonic-index"],
            },
            owner: flags.owner,
            factory: flags.factory,
        });
        // save deployment to local json file
        this.saveDeployment(deployment);

        this.log(
            `${chalk.green("✔")} Application deployed ${chalk.cyan(
                deployment.address,
            )}`,
        );
    }
}
