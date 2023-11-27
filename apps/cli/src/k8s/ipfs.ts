import { Chart, ChartProps } from "cdk8s";
import { Probe, Service, ServiceType, StatefulSet } from "cdk8s-plus-27";
import { Construct } from "constructs";

export interface IpfsProps extends ChartProps {
    port?: number;
    expose: boolean;
}

export class Ipfs extends Chart {
    public readonly service: Service;

    constructor(scope: Construct, id: string, props: IpfsProps) {
        super(scope, id, props);
        const port = props.port ?? 5001;
        const version = "v0.24.0";

        const labels = {
            "app.kubernetes.io/name": "kubo",
            "app.kubernetes.io/instance": "kubo",
            "app.kubernetes.io/version": version,
            "app.kubernetes.io/component": "ipfs",
            "app.kubernetes.io/part-of": "sunodo",
            "app.kubernetes.io/managed-by": "sunodo-cli",
        };

        const service = new Service(this, "service", {
            metadata: { labels },
            ports: [{ port }],
            type: props.expose
                ? ServiceType.LOAD_BALANCER
                : ServiceType.CLUSTER_IP,
        });

        // create deployment with devnet Docker image
        const statefulSet = new StatefulSet(this, "statefulSet", {
            metadata: { labels },
            containers: [
                {
                    image: `ipfs/kubo:${version}`,
                    portNumber: port,
                    readiness: Probe.fromCommand([
                        "ipfs",
                        "dag",
                        "stat",
                        "/ipfs/QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn", // CID of empty folder
                    ]),
                    securityContext: { ensureNonRoot: false }, // we should run as non-root
                },
            ],
            replicas: 1,
            service,
        });

        // create service for the deployment
        this.service = statefulSet.service;
    }
}
