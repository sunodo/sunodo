#!/usr/bin/env node
import { program } from "@commander-js/extra-typings";
import { unixfs } from "@helia/unixfs";
import { MemoryBlockstore } from "blockstore-core/memory";
import { ensureDirSync } from "fs-extra";
import { createHelia } from "helia";
import { CID } from "multiformats/cid";
import events from "node:events";
import ora from "ora";

// helia is causing MaxListenersExceededWarning, increase number here (default is 10)
events.EventEmitter.defaultMaxListeners = 100;

// @helia/delegated-routing-v1-http-api-client cancels the response body of aborted
// provider lookups while it is still being read, which rejects with "ReadableStream
// is locked" and nobody handles it. Ignore that rejection only, fail on any other.
process.on("unhandledRejection", (reason) => {
    if (
        reason instanceof TypeError &&
        "code" in reason &&
        reason.code === "ERR_INVALID_STATE" &&
        reason.message.includes("ReadableStream is locked")
    ) {
        return;
    }
    throw reason;
});

import { carfs, text } from "./index.js";

program
    .name("car-sync")
    .argument("<cid>", "Content ID of the CAR file")
    .argument("[output]", "Output directory", process.cwd())
    .action(async (cid, output) => {
        // create output directory if needed
        ensureDirSync(output);

        // create a helia instance, which connects to IPFS p2p network
        const blockstore = new MemoryBlockstore();
        const helia = await createHelia({ blockstore });
        const fs = unixfs(helia);
        const car = carfs(fs);
        let exitCode = 0;

        try {
            // traverse all CAR files recursively
            for await (const file of car.ls(CID.parse(cid))) {
                // download CID and link to file path
                const spinner = ora(file.path).start();
                try {
                    for await (const progress of car.save(file, output)) {
                        spinner.text = text(progress);
                        if (
                            progress.status === "downloaded" ||
                            progress.status === "cached"
                        ) {
                            spinner.succeed();
                        } else if (progress.status === "error") {
                            spinner.fail(progress.error);
                            exitCode = 1;
                        }
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (e: any) {
                    spinner.fail(e.message);
                    exitCode = 1;
                }
            }
        } catch (e: unknown) {
            exitCode = 1;
            console.error(e);
        } finally {
            await helia.stop();
        }

        // helia is hanging the process for some reason, even with the stop above
        // explicitly exit here
        process.exit(exitCode);
    });

program.parse();
