import { input, password as inputPassword } from "@inquirer/prompts";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { URL } from "url";
import { Hash } from "viem";

import { importDirectory, testConnection } from "./ipfs.js";

export type IPFSOptions = {
    url?: URL;
    username?: string;
    password?: string;
};

/**
 * Check the integrity of the cartesi machine and returns its hash
 * @param machine directory of cartesi machine snapshot to deploy
 * @returns hash of the machine
 */
const check = async (machine: string): Promise<Hash> => {
    if (!fs.existsSync(machine) || !fs.statSync(machine).isDirectory()) {
        throw new Error(
            "Cartesi machine snapshot not found, run 'sunodo build'",
        );
    }

    const templateHash = fs
        .readFileSync(path.join(machine, "hash"))
        .toString("hex");
    return `0x${templateHash}`;
};

/**
 * Publish the cartesi machine to IPFS
 * @param machine directory of cartesi machine snapshot to deploy
 * @param options
 * @returns selected publishing method and location of published machine
 */
const publish = async (
    machine: string,
    options: IPFSOptions,
): Promise<string> => {
    if (!options.url) {
        // test if there is a local IPFS node running locally
        const localhost = "http://127.0.0.1:5001";
        const localhostRunning =
            (await testConnection({ url: new URL(localhost) })) === "success";

        // ask for IPFS node URL, default is local node if there is one running
        const url = await input({
            message: "IPFS node URL",
            default: localhostRunning ? localhost : undefined,
        });
        options.url = new URL(url);
    }

    // try to connect with specified options
    let status = await testConnection(options);

    if (status === "unauthorized" && (!options.username || !options.password)) {
        // if received unauthorized, ask for username and password
        options.username =
            options.username || (await input({ message: "IPFS username" }));
        options.password =
            options.password ||
            (await inputPassword({ message: "IPFS password" }));

        // try again, with username/password
        status = await testConnection(options);
    }

    if (status !== "success") {
        throw new Error(`Error connecting to IPFS ${options.url}`);
    }

    return importDirectory(machine, options);
};

const deploy = async (
    machine: string,
    options: IPFSOptions,
): Promise<{ templateHash: Hash; location: string }> => {
    // check machine integrity and return its hash
    const templateHash = await check(machine);
    process.stdout.write(
        `${chalk.green("?")} Machine hash ${chalk.cyan(templateHash)}\n`,
    );

    // publish machine
    const location = await publish(machine, options);
    process.stdout.write(
        `${chalk.green("?")} Machine CID ${chalk.cyan(location)}\n`,
    );

    return {
        templateHash,
        location,
    };
};

export default deploy;
