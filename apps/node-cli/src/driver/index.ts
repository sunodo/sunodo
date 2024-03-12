import { CARFS } from "@sunodo/car-download";
import { Address, Hash } from "viem";

import { Logger, NullLogger } from "./logger.js";
import { IPFSMachineRepository } from "./machine.js";
import { RemoteDriver } from "./remote.js";
import { SubprocessDriver } from "./subprocess.js";

export type RemoteDriverConfig = {
    type: "remote";
    url: string;
};

export type SubprocessDriverConfig = {
    carfs: CARFS;
    env: NodeJS.ProcessEnv;
    machineDirectory: string;
    type: "subprocess";
};

export type NodeDriverConfig = RemoteDriverConfig | SubprocessDriverConfig;

export interface NodeDriver {
    start(dapp: Application, location: string): Promise<void>;
    stop(dapp: Application): Promise<void>;
}

export const createDriver = (
    config: NodeDriverConfig,
    logger?: Logger,
): NodeDriver => {
    switch (config.type) {
        case "remote": {
            return new RemoteDriver();
        }

        case "subprocess": {
            const machine = new IPFSMachineRepository(
                config.carfs,
                config.machineDirectory,
            );
            return new SubprocessDriver(
                machine,
                config.env,
                logger || new NullLogger(),
            );
        }
    }
};

export type Application = {
    address: Address;
    blockHash: Hash;
    blockNumber: bigint;
    shutdownAt: bigint;
    transactionHash: Hash;
};
