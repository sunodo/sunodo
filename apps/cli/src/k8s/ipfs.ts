import { Construct } from "constructs";
import { Chart, ChartProps } from "cdk8s";
import { Ingress, Service, StatefulSet } from "cdk8s-plus-27";

export interface IpfsChartProps extends ChartProps {}

export class IpfsChart extends Chart {
    public readonly service: Service;
    public readonly ingress: Ingress;

    constructor(scope: Construct, id: string, props: IpfsChartProps) {
        super(scope, id, props);

        // create deployment with devnet Docker image
        const statefulSet = new StatefulSet(this, "statefulSet", {
            containers: [
                {
                    image: `ipfs/go-ipfs:v0.24.0`,
                    portNumber: 5001,
                },
            ],
            replicas: 1,
        });

        // create service for the deployment
        this.service = statefulSet.service;

        // expose service to host via ingress
        this.ingress = this.service.exposeViaIngress("/");
    }
}
