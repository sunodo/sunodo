import { Application } from "./types";

export interface NodeManager {
    start(application: Application): Promise<void>;
    stop(application: Application): Promise<void>;
}
