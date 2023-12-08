#!/usr/bin/env node
import { program } from "@commander-js/extra-typings";
import { InvalidOptionArgumentError } from "commander";
import "dotenv/config";
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
        DEFAULT_PORT
    )
    .action(async (options) => {
        const { port } = options;
        const server = createServer();
        await server.listen({ port });
    });
program.parse();
