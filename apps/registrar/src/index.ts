import path from "path";
import { and, eq, gte, isNotNull, isNull, lt, or } from "ponder";
import { ponder } from "ponder:registry";
import { application } from "ponder:schema";
import { Address } from "viem";
import { applicationABI } from "../abis";
import { download } from "./download";
import { register, remove } from "./rollups";

const SNAPSHOTS_DIR =
    process.env.CARTESI_SNAPSHOTS_DIR ??
    "/var/lib/cartesi-rollups-node/snapshots";

/**
 * For now use the address as the name of the application.
 * @param address - the address of the application
 * @returns the name of the application
 */
const name = (address: Address) => {
    return address;
};

ponder.on("Provider:FinancialRunway", async ({ event, context }) => {
    const { args, block } = event;
    const { application: address, until } = args;
    const { client, db } = context;
    const now = block.timestamp;

    // read template hash
    const templateHash = await client.readContract({
        abi: applicationABI,
        address,
        functionName: "getTemplateHash",
    });

    const entity = await db.find(application, { address });
    if (entity) {
        if (until < now) {
            // can stop immediately
            await remove({ name: name(address) });

            // update our state
            await db
                .update(application, { address })
                .set({ until, status: "DISABLED" });
        } else {
            // just update our state
            await db.update(application, { address }).set({ until });
        }
    } else {
        // insert into applications table
        await db.insert(application).values({ address, templateHash, until });
    }
});

ponder.on("Provider:MachineLocation", async ({ event, context }) => {
    const { application: address, location } = event.args;
    const { client, db } = context;

    // read template hash
    const templateHash = await client.readContract({
        abi: applicationABI,
        address,
        functionName: "getTemplateHash",
    });

    // insert into applications table, or just update the location field
    await db
        .insert(application)
        .values({
            address,
            templateHash,
            location,
        })
        .onConflictDoUpdate(() => ({ location }));
});

ponder.on("Applications:block", async ({ event, context }) => {
    const { block } = event;
    const { db } = context;
    const now = block.timestamp;

    // download all pending application machines
    const pending = await db.sql
        .select()
        .from(application)
        .where(
            and(
                isNotNull(application.location),
                eq(application.localStatus, "PENDING"),
            ),
        );

    for (const entity of pending) {
        if (entity.location) {
            try {
                await download({
                    localPath: path.join(SNAPSHOTS_DIR, entity.templateHash),
                    remotePath: entity.location,
                    templateHash: entity.templateHash,
                });
                db.update(application, { address: entity.address }).set({
                    localStatus: "SUCCESS",
                });
            } catch (e: unknown) {
                db.update(application, { address: entity.address }).set({
                    localStatus: "ERROR",
                });
            }
        }
    }

    // get all disabled application which should start
    const start = await db.sql
        .select()
        .from(application)
        .where(
            and(
                gte(application.until, now),
                or(
                    eq(application.status, "DISABLED"),
                    isNull(application.status),
                ),
            ),
        );

    for (const entity of start) {
        const { address, templateHash } = entity;

        // register application to the node
        await register({
            address,
            name: name(address),
            templatePath: path.join(SNAPSHOTS_DIR, templateHash),
        });

        // update our state
        await db.update(application, { address }).set({ status: "ENABLED" });
    }

    // get all enabled application which should stop
    const stop = await db.sql
        .select()
        .from(application)
        .where(
            and(lt(application.until, now), eq(application.status, "ENABLED")),
        );

    for (const entity of stop) {
        const { address } = entity;

        // remove application from the node
        // TODO: should we also remove snapshot from disk?
        await remove({ name: name(address) });

        // update our state
        await db.update(application, { address }).set({ status: "DISABLED" });
    }
});
