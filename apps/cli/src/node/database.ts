import fs from "fs";
import { Address } from "viem";

import { Application } from "./index.js";

export class Database {
    // map of machine locations
    public readonly machines: Record<Address, string> = {};

    // sorted by shutdownAt
    public readonly applications: Application[] = [];

    // largest block of information update
    public block: bigint = 0n;

    // dapp array index where every dapp before (or equal) the index is in the past
    // (or present for equal), and every dapp after the index is in the future
    public now: number = -1;

    constructor(
        block: bigint = 0n,
        machines: Record<Address, string> = {},
        applications: Application[] = [],
    ) {
        this.block = block;
        this.machines = machines;
        this.applications = applications;
    }

    public store(filename: string) {
        fs.writeFileSync(
            filename,
            JSON.stringify(
                {
                    block: this.block.toString(),
                    machines: this.machines,
                    dapps: this.applications,
                },
                (_key, value) =>
                    typeof value === "bigint" ? value.toString() : value,
                4,
            ),
        );
    }

    public static load(filename: string, now: bigint): Database {
        const data = JSON.parse(fs.readFileSync(filename, "utf-8"));
        const store = new Database(
            BigInt(data.block),
            data.machines,
            data.dapps,
        );
        const index = store.applications.findIndex((d) => d.shutdownAt > now);
        store.now =
            store.applications.length == 0
                ? -1
                : index === -1
                ? store.applications.length
                : index;
        return store;
    }

    public addMachine(block: bigint, address: Address, machine: string) {
        this.block = block;
        this.machines[address] = machine;
    }

    public addApplication(
        now: bigint,
        application: Application,
    ): Application | undefined {
        this.block = application.blockNumber;

        if (this.applications.length == 0) {
            this.applications.push(application);

            // set now index correctly
            this.now = application.shutdownAt > now ? 0 : 1;

            // dapp should start, so return it
            return application.shutdownAt > now ? application : undefined;
        }

        // remove dapp if already exists
        const existing = this.applications.findIndex(
            (d) => d.address === application.address,
        );
        if (existing !== -1) {
            this.applications.splice(existing, 1);
        }

        // add in the correct order (sorted by shutdownAt)
        const index = this.applications.findIndex(
            (d) => d.shutdownAt > application.shutdownAt,
        );
        const insertIndex = index === -1 ? this.applications.length : index;
        this.applications.splice(insertIndex, 0, application);

        if (this.now >= insertIndex) {
            this.now++;
        }

        return application.shutdownAt > now ? application : undefined;
    }

    /**
     * Position the now pointer at the correct location, where "<= now" is in the past (or present for "=") and "> now" is in the future
     * @param now timestamp (milliseconds epoch as bigint)
     * @returns dapps that should be shutdown
     */
    public tick(now: bigint): Application[] {
        if (this.applications.length == 0) {
            // no dapps
            this.now = -1;
            return [];
        }

        const stop: Application[] = [];
        while (this.applications[this.now].shutdownAt <= now) {
            stop.push(this.applications[this.now]);
            this.now++;
            if (this.now == this.applications.length) {
                break;
            }
        }
        return stop;
    }
}
