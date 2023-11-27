import { Chart, ChartProps } from "cdk8s";
import { Deployment, Probe, Service, StatefulSet } from "cdk8s-plus-27";
import { Construct } from "constructs";

export interface RedisProps extends ChartProps {}

export class Redis extends Chart {
    public readonly service: Service;

    constructor(scope: Construct, id: string, props: RedisProps) {
        super(scope, id, props);

        const labels = {
            "app.kubernetes.io/name": "redis",
            "app.kubernetes.io/instance": "redis-master",
            "app.kubernetes.io/version": "6",
            "app.kubernetes.io/component": "broker",
            "app.kubernetes.io/part-of": "sunodo",
            "app.kubernetes.io/managed-by": "sunodo-cli",
        };

        // create deployment with devnet Docker image
        const deployment = new Deployment(this, "deployment", {
            metadata: { labels },
            containers: [
                {
                    image: "redis:6-alpine",
                    portNumber: 6379,
                    readiness: Probe.fromCommand(["redis-cli", "ping"]),
                    securityContext: { ensureNonRoot: false }, // we should run as non-root
                },
            ],
            replicas: 1,
        });

        // create service for the deployment
        this.service = deployment.exposeViaService();
        Object.entries(labels).forEach(([key, value]) =>
            this.service.metadata.addLabel(key, value)
        );
    }
}
