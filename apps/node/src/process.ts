import { execa, ExecaChildProcess } from "execa";
import { Address } from "viem";
import { Application } from "./types";
import { downloadMachine } from "./download";

const GRACEFUL_SHUTDOWN_TIMEOUT = 3000; // milliseconds
const INITIAL_PORT = 8000; // initial port number
const RESERVED_PORTS = 20; // number of ports each node uses
const processes: Record<Address, ExecaChildProcess> = {};

export const start = async (application: Application) => {
    const { address, blockNumber, snapshotUri } = application;

    // download cartesi machine snapshot
    const destination = `${process.env.CARTESI_SNAPSHOT_DIR}/${address}/0_0`;
    await downloadMachine(snapshotUri, destination);

    // spawn node process
    const port = INITIAL_PORT + RESERVED_PORTS * Object.keys(processes).length;
    const proc = execa("cartesi-rollups-node", {
        env: {
            CARTESI_CONTRACTS_DAPP_ADDRESS: address,
            CARTESI_CONTRACTS_DAPP_DEPLOYMENT_BLOCK_NUMBER:
                blockNumber.toString(),
            CARTESI_HTTP_PORT: port.toString(),
            CARTESI_SNAPSHOT_DIR: destination,
        },
        stdio: "inherit",
    });
    proc.on("exit", () => {});
    processes[address] = proc;
};

export const stop = async (application: Application) => {
    const { address } = application;

    // kill process
    const proc = processes[address];
    if (proc) {
        proc.kill("SIGTERM", {
            forceKillAfterTimeout: GRACEFUL_SHUTDOWN_TIMEOUT,
        });
    }
};
