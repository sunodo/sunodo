import { Address } from "abitype";
import { NodeDriver, NodeStatus } from "./index.js";

export class K8sDriver implements NodeDriver {
    constructor() {}

    async start(chainId: number, address: Address): Promise<NodeStatus> {
        throw new Error("not implemented");
    }

    async stop(chainId: number, address: Address): Promise<NodeStatus> {
        throw new Error("not implemented");
    }

    async getStatus(chainId: number, address: Address): Promise<NodeStatus> {
        throw new Error("not implemented");
    }

    async list(chainId: number): Promise<Address[]> {
        throw new Error("Method not implemented.");
    }
}
