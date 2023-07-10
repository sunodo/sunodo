import { Address } from "abitype";
import { NodeDriver, NodeStatus } from "./index.js";

export class FlyDriver implements NodeDriver {
    constructor() {}

    async start(address: Address): Promise<NodeStatus> {
        throw new Error("not implemented");
    }

    async stop(address: Address): Promise<NodeStatus> {
        throw new Error("not implemented");
    }
}
