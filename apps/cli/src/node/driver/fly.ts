import { FlyDriverConfig, NodeDriver } from "./index.js";
import { Application, Logger, NullLogger } from "../index.js";

export class FlyDriver implements NodeDriver {
    private config: FlyDriverConfig;
    private logger: Logger;

    constructor(config: FlyDriverConfig, logger?: Logger) {
        this.config = config;
        this.logger = logger || new NullLogger();
    }

    async start(application: Application, location: string): Promise<void> {
        throw new Error(`not implemented driver type: fly`);
    }

    async stop(application: Application): Promise<void> {
        throw new Error(`not implemented driver type: fly`);
    }
}
