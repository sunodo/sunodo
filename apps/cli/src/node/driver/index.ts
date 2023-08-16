import { Application, Logger } from "../index.js";
import { K8sDriver } from "./k8s.js";
import { FlyDriver } from "./fly.js";

export type FlyDriverConfig = { type: "fly" };
export type K8sDriverConfig = {
    type: "k8s";
    namespace: string;
};
export type NodeDriverConfig = FlyDriverConfig | K8sDriverConfig;

export interface NodeDriver {
    start(dapp: Application, location: string): Promise<void>;
    stop(dapp: Application): Promise<void>;
}

export const createDriver = (
    config: NodeDriverConfig,
    logger?: Logger,
): NodeDriver => {
    switch (config.type) {
        case "k8s":
            return new K8sDriver(config, logger);
        case "fly":
            return new FlyDriver(config, logger);
    }
};
