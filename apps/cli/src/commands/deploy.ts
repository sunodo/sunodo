import { Command, Flags } from "@oclif/core";
import path from "path";
import { URL } from "url";
import chalk from "chalk";

import deploy from "../deploy.js";
import * as CustomFlags from "../flags.js";
import { chains } from "../wallet.js";

export default class Deploy extends Command {
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

    static consensusFlags = {
        owner: CustomFlags.address({
            summary: "address of owner of the application",
            description:
                "the application owner has the power to change the consensus at any time",
            helpGroup: "Consensus",
        }),
        "consensus-authority": CustomFlags.address({
            summary: "address of authority smart contract",
            description:
                "An Authority has the power to submit any claims of the state of the application, and cannot be challenged",
            helpGroup: "Consensus",
            exclusive: [
                "consensus-multisig",
                "consensus-quorum",
                "consensus-unpermissioned",
            ],
        }),
        "consensus-multisig": CustomFlags.address({
            summary: "address of multisig smart contract",
            description:
                "The multisig is still an authority validator, where a set of validators who are part of a multisig contract must agree on the state of the application. If there is no agreement the application will be no longer validated, there is still no consensus protocol.",
            helpGroup: "Consensus",
            exclusive: [
                "consensus-authority",
                "consensus-quorum",
                "consensus-unpermissioned",
            ],
        }),
        "consensus-quorum": CustomFlags.address({
            summary: "address of quorum smart contract",
            description:
                "The application is validated by a quorum of validators, who must agree on the state of the machine. If there is any disagreement the verification protocol is initiated.",
            helpGroup: "Consensus",
            exclusive: [
                "consensus-authority",
                "consensus-multisig",
                "consensus-unpermissioned",
            ],
        }),
        "consensus-unpermissioned": CustomFlags.address({
            summary: "address of unpermissioned smart contract",
            description:
                "The application is validated by a quorum of validators, who must agree on the state of the machine. If there is any disagreement the verification protocol is initiated.",
            helpGroup: "Consensus",
            exclusive: [
                "consensus-authority",
                "consensus-multisig",
                "consensus-quorum",
            ],
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
        ...this.consensusFlags,
        webapp: Flags.url({
            description: "address of sunodo webapp",
            default: new URL("https://app.sunodo.io/deploy"),
            hidden: true,
        }),
    };

    private async keypress() {
        process.stdin.setRawMode(true);
        return new Promise((resolve) =>
            process.stdin.once("data", (d) => {
                process.stdin.setRawMode(false);
                resolve(d);
            })
        );
    }

    public async run(): Promise<void> {
        const { flags } = await this.parse(Deploy);

        const snapshot = path.join(".sunodo", "image");
        const application = await deploy(snapshot, {
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
            consensus: {
                owner: flags.owner,
                authority: flags["consensus-authority"],
                multisig: flags["consensus-multisig"],
                quorum: flags["consensus-quorum"],
                unpermissioned: flags["consensus-unpermissioned"],
            },
        });
        this.log(`${chalk.green("✔")} Application deployed ${chalk.cyan(application)}`);

        process.exit(0);
    }
}
