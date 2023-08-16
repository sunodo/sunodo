import k8s from "@kubernetes/client-node";

import { Application, Logger, NullLogger } from "../index.js";
import { K8sDriverConfig, NodeDriver } from "./index.js";

// definition of custom resource to use
const crd = {
    group: "rollups.cartesi.io",
    kind: "Application",
    version: "v1alpha1",
    plural: "applications",
};

export class K8sDriver implements NodeDriver {
    private config: K8sDriverConfig;
    private api: k8s.CustomObjectsApi;
    private logger: Logger;

    constructor(config: K8sDriverConfig, logger?: Logger) {
        this.config = config;
        this.logger = logger || new NullLogger();

        const kc = new k8s.KubeConfig();
        kc.loadFromDefault();
        this.api = kc.makeApiClient(k8s.CustomObjectsApi);
    }

    private getResourceName(application: Application): string {
        // this is the naming convention used by the k8s operator
        return `app-${application.address
            .substring(2, 10)
            .toLocaleLowerCase()}`;
    }

    async start(application: Application, location: string): Promise<void> {
        const { address, blockHash, blockNumber, transactionHash } =
            application;
        const namespace = this.config.namespace;
        const name = this.getResourceName(application);

        try {
            await this.api.createNamespacedCustomObject(
                crd.group,
                crd.version,
                namespace,
                crd.plural,
                {
                    apiVersion: `${crd.group}/${crd.version}`,
                    kind: crd.kind,
                    metadata: { name },
                    spec: {
                        address,
                        blockHash,
                        blockNumber: blockNumber.toString(),
                        transactionHash,
                        location,
                    },
                },
            );
            this.logger.info(`created ${crd.kind} ${name}`);
        } catch (err) {
            // API returns a 409 Conflict if CR already exists.
            if ((err as any).response?.statusCode !== 409) {
                if ((err as any).response?.statusCode === 404) {
                    throw new Error(
                        `${crd.group}/${crd.version} CRD not installed`,
                    );
                }
                throw err;
            }
            this.logger.info(`skipping existing ${crd.kind} ${name}`);
        }
    }

    async stop(application: Application): Promise<void> {
        const namespace = this.config.namespace;
        const name = this.getResourceName(application);
        await this.api.deleteNamespacedCustomObject(
            crd.group,
            crd.version,
            namespace,
            crd.plural,
            name,
        );
        this.logger.info(`deleted ${crd.kind} ${name}`);
    }
}
