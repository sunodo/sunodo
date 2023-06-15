import { Address } from "abitype";
import fs from "fs";

export type DApp = {
    address: Address;
    shutdownAt: bigint;
};

export class DAppStore {
    // map of machine locations
    public readonly machines: Record<Address, string> = {};

    // sorted by shutdownAt
    public readonly dapps: DApp[] = [];

    // largest block of information update
    public block: bigint = 0n;

    // dapp array index where every dapp before (or equal) the index is in the past
    // (or present for equal), and every dapp after the index is in the future
    public now: number = -1;

    constructor(
        block: bigint = 0n,
        machines: Record<Address, string> = {},
        dapps: DApp[] = []
    ) {
        this.block = block;
        this.machines = machines;
        this.dapps = dapps;
    }

    public store(filename: string) {
        fs.writeFileSync(
            filename,
            JSON.stringify(
                {
                    block: this.block.toString(),
                    machines: this.machines,
                    dapps: this.dapps,
                },
                (_key, value) =>
                    typeof value === "bigint" ? value.toString() : value,
                4
            )
        );
    }

    public static load(filename: string, now: bigint): DAppStore {
        const data = JSON.parse(fs.readFileSync(filename, "utf-8"));
        const store = new DAppStore(
            BigInt(data.block),
            data.machines,
            data.dapps
        );
        const index = store.dapps.findIndex((d) => d.shutdownAt > now);
        store.now =
            store.dapps.length == 0
                ? -1
                : index === -1
                ? store.dapps.length
                : index;
        return store;
    }

    public addMachine(block: bigint, address: Address, machine: string) {
        this.block = block;
        this.machines[address] = machine;
    }

    public addDApp(block: bigint, now: bigint, dapp: DApp): DApp | undefined {
        this.block = block;

        if (this.dapps.length == 0) {
            this.dapps.push(dapp);

            // set now index correctly
            this.now = dapp.shutdownAt > now ? 0 : 1;

            // dapp should start, so return it
            return dapp.shutdownAt > now ? dapp : undefined;
        }

        // remove dapp if already exists
        const existing = this.dapps.findIndex(
            (d) => d.address === dapp.address
        );
        if (existing !== -1) {
            this.dapps.splice(existing, 1);
        }

        // add in the correct order (sorted by shutdownAt)
        const index = this.dapps.findIndex(
            (d) => d.shutdownAt > dapp.shutdownAt
        );
        const insertIndex = index === -1 ? this.dapps.length : index;
        this.dapps.splice(insertIndex, 0, dapp);

        if (this.now >= insertIndex) {
            this.now++;
        }

        return dapp.shutdownAt > now ? dapp : undefined;
    }

    /**
     * Position the now pointer at the correct location, where "<= now" is in the past (or present for "=") and "> now" is in the future
     * @param now timestamp (milliseconds epoch as bigint)
     * @returns dapps that should be shutdown
     */
    public tick(now: bigint): DApp[] {
        if (this.dapps.length == 0) {
            // no dapps
            this.now = -1;
            return [];
        }

        const stop: DApp[] = [];
        while (this.dapps[this.now].shutdownAt <= now) {
            stop.push(this.dapps[this.now]);
            this.now++;
            if (this.now == this.dapps.length) {
                break;
            }
        }
        return stop;
    }
}
