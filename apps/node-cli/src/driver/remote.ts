import { Application, NodeDriver } from "./index.js";

/**
 * Uses HTTP node API for starting and stopping nodes
 */
export class RemoteDriver implements NodeDriver {

    async start(_application: Application, _location: string): Promise<void> {
        throw new Error("Remote driver not implemented");
    }

    async stop(_application: Application): Promise<void> {
        throw new Error("Remote driver not implemented");
    }
}
