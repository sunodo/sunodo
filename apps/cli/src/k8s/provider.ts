import { Construct } from "constructs";
import { Chart, ChartProps } from "cdk8s";
import {
    ConfigMap,
    Deployment,
    EnvValue,
    IConfigMap,
    Probe,
    Service,
} from "cdk8s-plus-27";

export interface Web3ProviderChartProps extends ChartProps {
    url?: string;
    forkUrl?: string;
    blockTime?: number;
    port?: number;
}

export class Web3ProviderChart extends Chart {
    public readonly configMap: IConfigMap;

    constructor(scope: Construct, id: string, props: Web3ProviderChartProps) {
        super(scope, id, props);
        const { url } = props;

        if (url) {
            // create config map for other services with provided URL
            this.configMap = new ConfigMap(this, "config", {
                data: { url },
            });
        } else {
            const port = props.port ?? 8545;
            const image = "sunodo/devnet";
            const version = "1.1.1";

            // create deployment with devnet Docker image
            const deployment = new Deployment(this, "deployment", {
                containers: [
                    {
                        image: `${image}:${version}`,
                        command: ["anvil"],
                        readiness: Probe.fromCommand(["eth_isready"]),
                        ports: [{ number: 8545 }],
                        envVariables: {
                            ANVIL_IP_ADDR: EnvValue.fromValue("0.0.0.0"),
                        },
                        securityContext: { ensureNonRoot: false }, // we should run devnet as non-root
                    },
                ],
                replicas: 1,
            });

            // create service for the deployment
            const service = new Service(this, "service");
            service.select(deployment.toPodSelector()!);
            service.bind(port, { targetPort: 8545 });

            // expose service to host via ingress
            const ingress = service.exposeViaIngress("/");

            // create config map for other services
            this.configMap = new ConfigMap(this, "config", {
                data: { url: service.clusterIP! },
            });
        }
    }
}
