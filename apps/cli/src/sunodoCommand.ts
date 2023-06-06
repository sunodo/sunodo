import fs from "fs";
import path from "path";
import { Command, Interfaces } from "@oclif/core";
import { execa } from "execa";
import { Abi, Address } from "abitype";
import { PsResponse } from "./types/docker";

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<
    (typeof SunodoCommand)["baseFlags"] & T["flags"]
>;
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T["args"]>;

export type AddressBook = Record<string, Address>;
export interface ContractExport {
    address: Address;
    abi: Abi;
    linkedData?: any;
}

export interface Export {
    chainId: string;
    name: string;
    contracts: {
        [name: string]: ContractExport;
    };
}

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
        serviceName: string
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
        const ps = JSON.parse(stdout) as PsResponse;
        return ps.length > 0 ? ps[0].State : undefined;
    }

    protected async getAddressBook(): Promise<AddressBook> {
        if (
            !fs.existsSync(path.join(".sunodo", "localhost.json")) ||
            !fs.existsSync(path.join(".sunodo", "dapp.json"))
        ) {
            const snapshot = path.join(".sunodo", "image");

            // check if snapshot exists
            if (
                !fs.existsSync(snapshot) ||
                !fs.statSync(snapshot).isDirectory()
            ) {
                throw new Error(
                    "Cartesi machine snapshot not found, run 'sunodo build'"
                );
            }

            // read hash of the cartesi machine snapshot
            const hash = fs
                .readFileSync(path.join(snapshot, "hash"))
                .toString("hex");
            const projectName = hash.substring(0, 8);

            // check if application is running
            if (
                (await this.getServiceState(projectName, "validator")) !==
                "running"
            ) {
                throw new Error(
                    "Cartesi application node not running, run 'sunodo run'"
                );
            }

            // copy deployment files to host
            const args = ["compose", "--project-name", projectName, "cp"];

            // copy files from docker compose environment
            await execa("docker", [
                ...args,
                "validator:/opt/cartesi/share/deployments/localhost.json",
                ".sunodo",
            ]);
            await execa("docker", [
                ...args,
                "validator:/opt/cartesi/share/deployments/dapp.json",
                ".sunodo",
            ]);
        }

        // parse files
        const localhost = JSON.parse(
            fs.readFileSync(path.join(".sunodo", "localhost.json"), "utf-8")
        ) as Export;
        const dapp = JSON.parse(
            fs.readFileSync(path.join(".sunodo", "dapp.json"), "utf-8")
        ) as DApp;

        // build address book
        const contracts = Object.entries(
            localhost.contracts
        ).reduce<AddressBook>((acc, [name, { address }]) => {
            acc[name] = address;
            return acc;
        }, {});

        // add deployed dapp address
        contracts["CartesiDApp"] = dapp.address;
        return contracts;
    }

    public async init(): Promise<void> {
        await super.init();
        const { args, flags } = await this.parse({
            flags: this.ctor.flags,
            baseFlags: (super.ctor as typeof SunodoCommand).baseFlags,
            args: this.ctor.args,
            strict: this.ctor.strict,
        });
        this.flags = flags as Flags<T>;
        this.args = args as Args<T>;
    }
}
