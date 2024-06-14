import { CARFS, text } from "@sunodo/car-sync";
import { ExecaChildProcess, execa } from "execa";
import { copy } from "fs-extra";
import { CID } from "multiformats/cid";
import ora from "ora";
import { Address } from "viem";
import { NodeManager } from "./manager";
import { Application } from "./types";

const DEFAULT_GRACEFUL_SHUTDOWN_TIMEOUT = 3000; // milliseconds
const DEFAULT_INITIAL_PORT = 8000; // initial port number
const RESERVED_PORTS = 20; // number of ports each node uses

export interface ProcessNodeManagerOptions {
    car: CARFS;
    gracefulShutdownTimeout?: number;
    initialPort?: number;
}

export class ProcessNodeManager implements NodeManager {
    private car: CARFS;
    private gracefulShutdownTimeout: number;
    private initialPort: number;
    private processes: Record<Address, ExecaChildProcess> = {};

    constructor(options: ProcessNodeManagerOptions) {
        this.car = options.car;
        this.gracefulShutdownTimeout =
            options.gracefulShutdownTimeout ||
            DEFAULT_GRACEFUL_SHUTDOWN_TIMEOUT;
        this.initialPort = options.initialPort || DEFAULT_INITIAL_PORT;
    }

    async download(snapshotUri: string, destination: string): Promise<void> {
        const url = new URL(snapshotUri);
        switch (url.protocol) {
            case "http:":
            case "https:":
                throw new Error("HTTP(S) download not supported");
            case "file:":
                await copy(url.pathname, destination);
            case "ipfs":
                const cid = CID.parse(url.pathname);
                for await (const file of this.car.ls(cid)) {
                    const spinner = ora(file.path).start();
                    for await (const progress of this.car.save(
                        file,
                        destination,
                    )) {
                        spinner.text = text(progress);
                        if (
                            progress.status === "downloaded" ||
                            progress.status === "cached"
                        ) {
                            spinner.succeed();
                        } else if (progress.status === "error") {
                            spinner.fail(progress.error);
                        }
                    }
                }
            default:
                throw new Error(`Unsupported protocol: ${url.protocol}`);
        }
    }

    async start(application: Application): Promise<void> {
        const { address, blockNumber, snapshotUri } = application;

        // download cartesi machine snapshot
        const destination = `${process.env.CARTESI_SNAPSHOT_DIR}/${address}/0_0`;
        await this.download(snapshotUri, destination);

        // spawn node process
        const port =
            this.initialPort +
            RESERVED_PORTS * Object.keys(this.processes).length;
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
        this.processes[address] = proc;
    }

    async stop(application: Application): Promise<void> {
        const { address } = application;

        // kill process
        const proc = this.processes[address];
        if (proc) {
            proc.kill("SIGTERM", {
                forceKillAfterTimeout: this.gracefulShutdownTimeout,
            });
        }
    }
}
