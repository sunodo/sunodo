import { Construct } from "constructs";
import { Chart, ChartProps } from "cdk8s";
import { Deployment, EnvValue, Ingress, Probe, Service } from "cdk8s-plus-27";

export interface Web3ProviderChartProps extends ChartProps {
    forkUrl?: string;
    blockTime?: number;
    port?: number;
}

export class Web3ProviderChart extends Chart {
    public readonly service: Service;
    public readonly ingress: Ingress;

    constructor(scope: Construct, id: string, props: Web3ProviderChartProps) {
        super(scope, id, props);

        const port = props.port ?? 8545;
        const blockTime = props.blockTime ?? 5; // seconds
        const image = "sunodo/devnet";
        const version = "1.1.1";

        // create deployment with devnet Docker image
        const deployment = new Deployment(this, "deployment", {
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
                    portNumber: 8545,
                    envVariables: {
                        ANVIL_IP_ADDR: EnvValue.fromValue("0.0.0.0"),
                    },
                    securityContext: { ensureNonRoot: false }, // we should run devnet as non-root
                },
            ],
            replicas: 1,
        });

        // create service for the deployment
        this.service = deployment.exposeViaService();

        // expose service to host via ingress
        this.ingress = this.service.exposeViaIngress("/");
    }
}
