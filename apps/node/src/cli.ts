#!/usr/bin/env node
import { program } from "@commander-js/extra-typings";
import { unixfs } from "@helia/unixfs";
import { carfs } from "@sunodo/car-sync";
import { InvalidOptionArgumentError } from "commander";
import "dotenv/config";
import { createHelia } from "helia";
import { ProcessNodeManager } from "./process";
import { createServer } from "./server";

const numberValidator = (value: string) => {
    const valueNumber = parseInt(value);
    if (isNaN(valueNumber)) {
        throw new InvalidOptionArgumentError(`"${value}" is not a number.`);
    }
    return valueNumber;
};

// Default to `0` (picks the first available open port)
const DEFAULT_PORT = 0;

program
    .option(
        "-p, --port <port>",
        "port to listen on",
        numberValidator,
        DEFAULT_PORT,
    )
    .action(async (options) => {
        const { port } = options;

        // create IPFS embedded node
        const helia = await createHelia();
        const fs = unixfs(helia);
        const car = carfs(fs);

        // creates a node manager using simple processes
        const manager = new ProcessNodeManager({ car });

        // create a HTTP server
        const server = createServer(manager);
        await server.listen({ port });
    });
program.parse();
