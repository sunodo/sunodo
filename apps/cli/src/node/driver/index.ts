import { Address } from "abitype";
import { DockerDriver } from "./docker.js";
import { FlyDriver } from "./fly.js";
import { K8sDriver } from "./k8s.js";

export type NodeStatus =
    | "starting"
    | "started"
    | "stopping"
    | "stopped"
    | "error"
    | "unknown";

export interface NodeDriver {
    start(address: Address, location: string): Promise<NodeStatus>;
    stop(address: Address): Promise<NodeStatus>;
}

export const createDriver = (
    type: string,
    machineDir: string,
    ipfs: URL
): NodeDriver => {
    switch (type) {
        case "docker":
            return new DockerDriver(machineDir, ipfs);
        case "fly":
            return new FlyDriver();
        case "k8s":
            return new K8sDriver();
    }
    throw new Error(`Unsupported driver type: ${type}`);
};
