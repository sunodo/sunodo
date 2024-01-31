import { Address } from "viem";
import { Application, ApplicationStatus } from "./types.js";

export interface ApplicationRepository {
    list(
        offset: number,
        limit: number,
        status?: ApplicationStatus,
    ): Promise<Application[]>;
    count(status?: ApplicationStatus): Promise<number>;
    create(application: Application): Promise<Application>;
    find(address: Address): Promise<Application | undefined>;
    remove(address: Address): Promise<void>;
}

export class InMemoryApplicationRepository implements ApplicationRepository {
    private applications: Application[] = [];

    public async list(
        offset: number = 0,
        limit: number = -1,
        status?: ApplicationStatus,
    ): Promise<Application[]> {
        const apps = status
            ? this.applications.filter((app) => app.status === status)
            : this.applications;
        return apps.slice(offset, limit >= 0 ? offset + limit : undefined);
    }

    async count(status?: ApplicationStatus): Promise<number> {
        const apps = status
            ? this.applications.filter((app) => app.status === status)
            : this.applications;
        return apps.length;
    }

    public async create(application: Application): Promise<Application> {
        const { address } = application;

        // return existing application if it exists
        const existing = this.applications.find((app) => app.address === address);
        if (existing) {
            return existing;
        }

        // add to array
        this.applications.push(application);

        return application;
    }

    public async find(address: Address): Promise<Application | undefined> {
        return this.applications.find((app) => app.address === address);
    }

    public async remove(address: Address): Promise<void> {
        // remove from array
        const index = this.applications.findIndex((app) => app.address === address);
        if (index >= 0) {
            this.applications.splice(index, 1);
        }
        return;
    }
}
