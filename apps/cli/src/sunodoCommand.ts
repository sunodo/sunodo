import { Command, Interfaces } from "@oclif/core";
import { execa } from "execa";
import fs from "fs";
import path from "path";
import { Address, Hash, isHash } from "viem";

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
    selfHostedApplicationFactoryAddress,
    sunodoTokenAddress,
} from "./contracts.js";
import { PsResponse } from "./types/docker.js";

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

    protected getMachineHash(): Hash | undefined {
        // read hash of the cartesi machine snapshot, if one exists
        const hashPath = path.join(".sunodo", "image", "hash");
        if (fs.existsSync(hashPath)) {
            const hash = fs.readFileSync(hashPath).toString("hex");
            if (isHash(`0x${hash}`)) {
                return `0x${hash}`;
            }
        }
        return undefined;
    }

    protected async getApplicationAddress(): Promise<Address | undefined> {
        // fixed value, as we do deterministic deployment with a zero hash
        return "0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e";
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
            SelfHostedApplicationFactory: selfHostedApplicationFactoryAddress,
            SunodoToken: sunodoTokenAddress,
        };

        // get dapp address
        const applicationAddress = await this.getApplicationAddress();
        if (applicationAddress) {
            contracts["CartesiDApp"] = applicationAddress;
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
