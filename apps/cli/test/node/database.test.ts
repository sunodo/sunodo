import { rmSync } from "fs";
import { tmpNameSync } from "tmp";
import { describe, expect, test } from "vitest";

import { Database } from "../../src/node/database";

describe("database", () => {
    test("empty", () => {
        const db = new Database();
        expect(db.applications).toHaveLength(0);
    });

    test("store and load at same time", () => {
        const db = new Database();
        const now: bigint = BigInt(Date.now());
        db.addMachine(1n, "0xdeadbeef", "C123");
        db.addMachine(1n, "0x123", "Que2");
        db.addApplication(now, {
            blockNumber: 2n,
            blockHash: "0xdeadbeef",
            transactionHash: "0xdeadbeef",
            address: "0xdeadbeef",
            shutdownAt: now + 1000n,
        });
        db.addApplication(now, {
            blockNumber: 3n,
            blockHash: "0xdeadbeef",
            transactionHash: "0xdeadbeef",
            address: "0x123",
            shutdownAt: now + 500n,
        });
        const tmp = tmpNameSync();
        db.store(tmp);

        // load with same time
        const db2 = Database.load(tmp, now);
        expect(db2.block).toBe(3n);
        expect(db2.applications).toHaveLength(2);
        expect(Object.keys(db2.machines)).toHaveLength(2);
        expect(db2.applications[0].address).toBe("0x123");
        expect(db2.applications[1].address).toBe("0xdeadbeef");
        expect(db2.now).toBe(0);
        rmSync(tmp);
    });

    test("store and load at future time", () => {
        const db = new Database();
        const now: bigint = BigInt(Date.now());
        db.addMachine(1n, "0xdeadbeef", "C123");
        db.addMachine(1n, "0x123", "Que2");
        db.addApplication(now, {
            blockNumber: 2n,
            blockHash: "0xdeadbeef",
            transactionHash: "0xdeadbeef",
            address: "0xdeadbeef",
            shutdownAt: now + 1000n,
        });
        db.addApplication(now, {
            blockNumber: 3n,
            blockHash: "0xdeadbeef",
            transactionHash: "0xdeadbeef",
            address: "0x123",
            shutdownAt: now + 500n,
        });
        const tmp = tmpNameSync();
        db.store(tmp);

        // load at a future time
        const db2 = Database.load(tmp, now + 2000n);
        expect(db2.block).toBe(3n);
        expect(db2.applications).toHaveLength(2);
        expect(Object.keys(db2.machines)).toHaveLength(2);
        expect(db2.applications[0].address).toBe("0x123");
        expect(db2.applications[1].address).toBe("0xdeadbeef");
        expect(db2.now).toBe(2);
        rmSync(tmp);
    });

    test("tick with no applications", () => {
        const db = new Database();
        const now: bigint = BigInt(Date.now());
        expect(db.tick(now)).toHaveLength(0);
    });

    test("tick", () => {
        // [ ]
        // now = -1
        const db = new Database();
        const now: bigint = BigInt(Date.now());

        // [ +1s ]
        // ^
        // |
        //  -- now
        expect(
            db.addApplication(now, {
                blockNumber: 1n,
                blockHash: "0xdeadbeef",
                transactionHash: "0xdeadbeef",
                address: "0x1",
                shutdownAt: now + 1000n,
            }),
        ).toBeDefined();
        expect(db.now).toBe(0);

        // [ +1s, +2s ]
        // ^
        // |
        //  -- now
        expect(
            db.addApplication(now, {
                blockNumber: 2n,
                blockHash: "0xdeadbeef",
                transactionHash: "0xdeadbeef",
                address: "0x2",
                shutdownAt: now + 2000n,
            }),
        ).toBeDefined();
        expect(db.now).toBe(0);

        // [ +1s, +2s, +4s ]
        // ^
        // |
        //  -- now
        expect(
            db.addApplication(now, {
                blockNumber: 3n,
                blockHash: "0xdeadbeef",
                transactionHash: "0xdeadbeef",
                address: "0x3",
                shutdownAt: now + 4000n,
            }),
        ).toBeDefined();
        expect(db.now).toBe(0);

        // [ -1s, +1s, +2s, +4s ]
        //       ^
        //       |
        //       -- now
        expect(
            db.addApplication(now, {
                blockNumber: 4n,
                blockHash: "0xdeadbeef",
                transactionHash: "0xdeadbeef",
                address: "0x4",
                shutdownAt: now - 1000n,
            }),
        ).toBeUndefined();
        expect(db.now).toBe(1);

        // [ -4s, -1s, +1s, +2s, +4s ]
        //            ^
        //            |
        //            -- now
        expect(
            db.addApplication(now, {
                blockNumber: 5n,
                blockHash: "0xdeadbeef",
                transactionHash: "0xdeadbeef",
                address: "0x5",
                shutdownAt: now - 4000n,
            }),
        ).toBeUndefined();
        expect(db.now).toBe(2);

        // [ -4s, -1s, +1s, +2s, +4s ]
        //                 ^
        //                 |
        //                 -- now
        expect(db.tick(now + 1000n)).toHaveLength(1);
        expect(db.now).toBe(3);

        // [ -4s, -1s, +1s, +2s, +4s ]
        //                      ^
        //                      |
        //                      -- now
        expect(db.tick(now + 2000n)).toHaveLength(1);
        expect(db.now).toBe(4);

        // [ -4s, -1s, +1s, +2s, +4s ]
        //                      ^
        //                      |
        //                      -- now
        expect(db.tick(now + 3000n)).toHaveLength(0);
        expect(db.now).toBe(4);

        // [ -4s, -1s, +1s, +2s, +4s ]
        //                           ^
        //                           |
        //                           -- now
        expect(db.tick(now + 4000n)).toHaveLength(1);
        expect(db.now).toBe(5);
    });
});
