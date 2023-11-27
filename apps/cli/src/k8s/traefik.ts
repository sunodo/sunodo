import { Construct } from "constructs";
import { Chart, ChartProps } from "cdk8s";
import {
    ApiResource,
    ClusterRole,
    Deployment,
    Probe,
    Service,
    ServiceAccount,
    ServiceType,
} from "cdk8s-plus-27";
import { KubeIngressClass } from "cdk8s-plus-27/lib/imports/k8s.js";

export interface TraefikProps extends ChartProps {
    port: number;
}

export class Traefik extends Chart {
    public readonly service: Service;

    constructor(scope: Construct, id: string, props: TraefikProps) {
        super(scope, id, props);
        const { port } = props;
        const image = "traefik";
        const version = "v2.10.5";

        const labels = {
            "app.kubernetes.io/name": "traefik",
            "app.kubernetes.io/instance": "traefik",
            "app.kubernetes.io/version": version,
            "app.kubernetes.io/component": "proxy",
            "app.kubernetes.io/part-of": "sunodo",
            "app.kubernetes.io/managed-by": "sunodo-cli",
        };

        const serviceAccount = new ServiceAccount(this, "service-account", {
            metadata: { namespace: props.namespace ?? "default", labels },
        });

        const clusterRole = new ClusterRole(this, "cluster-role");
        clusterRole.allow(
            ["get", "list", "watch"],
            ApiResource.INGRESS_CLASSES,
            ApiResource.INGRESSES,
            ApiResource.ENDPOINTS,
            ApiResource.SECRETS,
            ApiResource.SERVICES
        );
        clusterRole.allowUpdate(
            ApiResource.custom({
                apiGroup: "networking.k8s.io",
                resourceType: "ingresses/status",
            })
        );
        const crds = [
            "ingressroutes",
            "ingressroutetcps",
            "ingressrouteudps",
            "middlewares",
            "middlewaretcps",
            "tlsoptions",
            "tlsstores",
            "traefikservices",
            "serverstransports",
        ]
            .map((resourceType) => [
                ApiResource.custom({ apiGroup: "traefik.io", resourceType }),
                ApiResource.custom({
                    apiGroup: "traefik.containo.us",
                    resourceType,
                }),
            ])
            .flat();
        clusterRole.allow(["get", "list", "watch"], ...crds);
        clusterRole.bind(serviceAccount);

        // create deployment with devnet Docker image
        const deployment = new Deployment(this, "deployment", {
            metadata: { labels },
            containers: [
                {
                    image: `${image}:${version}`,
                    ports: [
                        { name: "traefik", number: 9000 },
                        { name: "metrics", number: 9100 },
                        { name: "web", number: 8000 },
                    ],
                    readiness: Probe.fromHttpGet("/ping", { port: 9000 }),
                    liveness: Probe.fromHttpGet("/ping", { port: 9000 }),
                    args: [
                        "--entrypoints.metrics.address=:9100/tcp",
                        "--entrypoints.traefik.address=:9000/tcp",
                        "--entrypoints.web.address=:8000/tcp",
                        "--api.dashboard=true",
                        "--ping=true",
                        "--log.level=DEBUG",
                        "--metrics.prometheus=true",
                        "--metrics.prometheus.entrypoint=metrics",
                        "--providers.kubernetescrd",
                        "--providers.kubernetesingress",
                    ],
                    securityContext: { group: 65532, user: 65532 },
                },
            ],
            automountServiceAccountToken: true,
            replicas: 1,
            serviceAccount,
        });

        // create service for the deployment
        this.service = deployment.exposeViaService({
            serviceType: ServiceType.LOAD_BALANCER,
            ports: [{ port, targetPort: 8000 }],
        });

        // create ingress class for traefik
        new KubeIngressClass(this, "ingress-class", {
            spec: { controller: "traefik.io/ingress-controller" },
        });
    }
}
