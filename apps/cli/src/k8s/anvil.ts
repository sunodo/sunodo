import { Construct } from "constructs";
import { Chart, ChartProps } from "cdk8s";
import {
    Deployment,
    EnvValue,
    Probe,
    Service,
    ServiceType,
} from "cdk8s-plus-27";

export interface AnvilProps extends ChartProps {
    forkUrl?: string;
    blockTime?: number;
    port?: number;
}

export class Anvil extends Chart {
    public readonly service: Service;

    constructor(scope: Construct, id: string, props: AnvilProps) {
        super(scope, id, props);

        const labels = {
            "app.kubernetes.io/name": "anvil",
            "app.kubernetes.io/instance": "anvil-devnet",
            "app.kubernetes.io/version": "nightly",
            "app.kubernetes.io/component": "ethereum-gateway",
            "app.kubernetes.io/part-of": "sunodo",
            "app.kubernetes.io/managed-by": "sunodo-cli",
        };

        const port = props.port ?? 8545;
        const blockTime = props.blockTime ?? 5; // seconds
        const image = "sunodo/devnet";
        const version = "1.1.1";

        // create deployment with devnet Docker image
        const deployment = new Deployment(this, "deployment", {
            metadata: { labels },
            containers: [
                {
                    image: `${image}:${version}`,
                    command: [
                        "anvil",
                        "--load-state",
                        "/usr/share/sunodo/anvil_state.json",
                        "--block-time",
                        blockTime.toString(),
                    ],
                    readiness: Probe.fromCommand(["eth_isready"]),
                    portNumber: port,
                    envVariables: {
                        ANVIL_IP_ADDR: EnvValue.fromValue("0.0.0.0"),
                    },
                    securityContext: { ensureNonRoot: false }, // we should run devnet as non-root
                },
            ],
            replicas: 1,
        });

        // create service for the deployment
        this.service = deployment.exposeViaService({
            serviceType: ServiceType.LOAD_BALANCER,
        });
        Object.entries(labels).forEach(([key, value]) =>
            this.service.metadata.addLabel(key, value)
        );
    }
}
