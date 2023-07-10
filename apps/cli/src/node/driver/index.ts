import { Address } from "abitype";
import { ComposeDriver } from "./compose.js";
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
    start(
        chainId: number,
        address: Address,
        location: string
    ): Promise<NodeStatus>;
    stop(chainId: number, address: Address): Promise<NodeStatus>;
    list(chainId: number): Promise<Address[]>; // XXX: what about node status?
    getStatus(chainId: number, address: Address): Promise<NodeStatus>;
}

const drivers: Record<string, NodeDriver> = {
    compose: new ComposeDriver(),
    fly: new FlyDriver(),
    k8s: new K8sDriver(),
};

export default drivers;
