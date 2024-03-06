import { ExecaChildProcess, execa } from "execa";
import { Address } from "viem";

import { Application, NodeDriver } from "./index.js";
import { Logger } from "./logger.js";
import { IPFSMachineRepository } from "./machine.js";

const GRACEFUL_SHUTDOWN_TIMEOUT = 3000; // milliseconds
const INITIAL_PORT = 8000; // initial port number
const RESERVED_PORTS = 20; // number of ports each node uses

/**
 * Spawn new Cartesi nodes for each application
 */
export class SubprocessDriver implements NodeDriver {
    private env: NodeJS.ProcessEnv;
    private logger: Logger;
    private machine: IPFSMachineRepository;
    private processes: Record<Address, ExecaChildProcess> = {};

    constructor(
        machine: IPFSMachineRepository,
        env: NodeJS.ProcessEnv,
        logger: Logger,
    ) {
        this.machine = machine;
        this.env = env;
        this.logger = logger;
    }

    async start(application: Application, location: string): Promise<void> {
        this.logger.info(
            `starting node for application ${application.address}`,
        );
        const { address, blockNumber } = application;

        // download cartesi machine snapshot
        this.logger.info(
            `downloading machine ${location} to ${this.machine.destination}`,
        );
        const snapshot = await this.machine.download(location);

        // spawn node process
        const port =
            INITIAL_PORT + RESERVED_PORTS * Object.keys(this.processes).length;
        const proc = execa("cartesi-rollups-node", {
            env: {
                ...this.env, // inherit environment variables
                CARTESI_CONTRACTS_DAPP_ADDRESS: address,
                CARTESI_CONTRACTS_DAPP_DEPLOYMENT_BLOCK_NUMBER:
                    blockNumber.toString(),
                CARTESI_HTTP_PORT: port.toString(),
                CARTESI_SNAPSHOT_DIR: snapshot,
            },
            stdio: "inherit",
        });
        proc.on("exit", () => {});
        this.processes[address] = proc;
    }

    async stop(application: Application): Promise<void> {
        this.logger.info(
            `stopping node for application ${application.address}`,
        );
        const { address } = application;

        // kill process
        const proc = this.processes[address];
        if (proc) {
            proc.kill("SIGTERM", {
                forceKillAfterTimeout: GRACEFUL_SHUTDOWN_TIMEOUT,
            });
        }
    }
}
