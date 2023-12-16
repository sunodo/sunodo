import fs from "fs";
import path from "path";
import { Command, Interfaces } from "@oclif/core";
import { execa } from "execa";
import { Address } from "abitype";
import { PsResponse } from "./types/docker.js";
import {
    authorityHistoryPairFactoryAddress,
    cartesiDAppFactoryAddress,
    dAppAddressRelayAddress,
    erc1155BatchPortalAddress,
    erc1155SinglePortalAddress,
    erc20PortalAddress,
    erc721PortalAddress,
    etherPortalAddress,
    inputBoxAddress,
    marketplaceAddress,
    sunodoTokenAddress,
} from "./contracts.js";

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<
    (typeof SunodoCommand)["baseFlags"] & T["flags"]
>;
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T["args"]>;

export type AddressBook = Record<string, Address>;
export interface DApp {
    address: Address;
    blockHash: Address;
    blockNumber: number;
    transactionHash: Address;
}

export abstract class SunodoCommand<T extends typeof Command> extends Command {
    protected flags!: Flags<T>;
    protected args!: Args<T>;

    protected async getServiceState(
        projectName: string,
        serviceName: string,
    ): Promise<string | undefined> {
        // get service information
        const { stdout } = await execa("docker", [
            "compose",
            "--project-name",
            projectName,
            "ps",
            serviceName,
            "--format",
            "json",
        ]);
        const ps = stdout ? (JSON.parse(stdout) as PsResponse) : undefined;
        return ps?.State;
    }

    protected async getDAppAddress(): Promise<Address | undefined> {
        // read hash of the cartesi machine snapshot, if one exists
        const hashPath = path.join(".sunodo", "image", "hash");
        if (fs.existsSync(hashPath)) {
            const hash = fs.readFileSync(hashPath).toString("hex");
            const projectName = hash.substring(0, 8);

            // check if application (with machine) is running
            const projectState = await this.getServiceState(
                projectName,
                "anvil",
            );
            if (projectState === "running") {
                // get dapp.json content from the container
                const { stdout } = await execa("docker", [
                    "compose",
                    "--project-name",
                    projectName,
                    "exec",
                    "anvil", // service name
                    "cat",
                    "/usr/share/sunodo/dapp.json",
                ]);
                const dapp = JSON.parse(stdout) as DApp;
                return dapp.address;
            }
        }

        // check if there is a node running with no-backend
        const projectName = "sunodo-node";
        const projectState = await this.getServiceState(projectName, "anvil");
        if (projectState === "running") {
            // copy deployment file from container to host
            const { stdout } = await execa("docker", [
                "compose",
                "--project-name",
                projectName,
                "exec",
                "anvil", // service name
                "cat",
                "/usr/share/sunodo/dapp.json",
            ]);

            const dapp = JSON.parse(stdout) as DApp;
            return dapp.address;
        }

        return undefined;
    }

    protected async getAddressBook(): Promise<AddressBook> {
        // build rollups contracts address book
        const contracts: AddressBook = {
            AuthorityHistoryPairFactory: authorityHistoryPairFactoryAddress,
            CartesiDAppFactory: cartesiDAppFactoryAddress,
            DAppAddressRelay: dAppAddressRelayAddress,
            ERC1155BatchPortal: erc1155BatchPortalAddress,
            ERC1155SinglePortal: erc1155SinglePortalAddress,
            ERC20Portal: erc20PortalAddress,
            ERC721Portal: erc721PortalAddress,
            EtherPortal: etherPortalAddress,
            InputBox: inputBoxAddress,
            Marketplace: marketplaceAddress,
            SunodoToken: sunodoTokenAddress,
        };

        // get dapp address
        const dapp = await this.getDAppAddress();
        if (dapp) {
            contracts["CartesiDApp"] = dapp;
        }
        return contracts;
    }

    public async init(): Promise<void> {
        await super.init();
        const { args, flags } = await this.parse({
            flags: this.ctor.flags,
            baseFlags: (super.ctor as typeof SunodoCommand).baseFlags,
            args: this.ctor.args,
            enableJsonFlag: this.ctor.enableJsonFlag,
            strict: this.ctor.strict,
        });
        this.flags = flags as Flags<T>;
        this.args = args as Args<T>;
    }
}
