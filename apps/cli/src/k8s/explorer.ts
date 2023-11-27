import { Chart, ChartProps } from "cdk8s";
import {
    Deployment,
    EnvFrom,
    EnvValue,
    IConfigMap,
    ISecret,
} from "cdk8s-plus-27";
import { Construct } from "constructs";
import {
    IngressRoute,
    IngressRouteSpecRoutesKind,
    IngressRouteSpecRoutesServicesPort,
    Middleware,
} from "./traefik.io.js";

export interface ExplorerProps extends ChartProps {
    providerConfigMap: IConfigMap;
    databaseConfigMap: IConfigMap;
    databaseSecret: ISecret;
}

export class Explorer extends Chart {
    constructor(scope: Construct, id: string, props: ExplorerProps) {
        super(scope, id, props);
        const { providerConfigMap, databaseConfigMap, databaseSecret } = props;

        const labels = {
            "app.kubernetes.io/name": "rollups-explorer",
            "app.kubernetes.io/instance": "rollups-explorer",
            "app.kubernetes.io/version": "0.1.0",
            "app.kubernetes.io/component": "explorer",
            "app.kubernetes.io/part-of": "sunodo",
            "app.kubernetes.io/managed-by": "sunodo-cli",
        };

        // create deployment with devnet Docker image
        const squidDbVars = {
            DB_NAME: EnvValue.fromConfigMap(databaseConfigMap, "PGDATABASE"),
            DB_PORT: EnvValue.fromConfigMap(databaseConfigMap, "PGPORT"),
            DB_HOST: EnvValue.fromConfigMap(databaseConfigMap, "PGHOST"),
            DB_USER: EnvValue.fromConfigMap(databaseConfigMap, "PGUSER"),
            DB_PASS: databaseSecret.envValue("PGPASSWORD"),
        };

        const deployment = new Deployment(this, "deployment", {
            metadata: { labels },
            containers: [
                {
                    image: "cartesi/rollups-explorer-api:0.1.0",
                    command: ["sqd", "process:prod"],
                    name: "processor",
                    securityContext: { ensureNonRoot: false },
                    envVariables: {
                        ...squidDbVars,
                        CHAIN_ID: EnvValue.fromConfigMap(
                            providerConfigMap,
                            "CHAIN_ID"
                        ),
                        RPC_ENDPOINT: EnvValue.fromConfigMap(
                            providerConfigMap,
                            "PROVIDER_HTTP_ENDPOINT"
                        ),
                        PROCESSOR_PROMETHEUS_PORT: EnvValue.fromValue("3001"),
                    },
                },
                {
                    image: "cartesi/rollups-explorer-api:0.1.0",
                    command: ["sqd", "serve:prod"],
                    name: "graphql",
                    portNumber: 4350,
                    securityContext: { ensureNonRoot: false },
                    envVariables: {
                        ...squidDbVars,
                        GQL_PORT: EnvValue.fromValue("4350"),
                    },
                },
                {
                    image: "cartesi/rollups-explorer:0.1.1",
                    portNumber: 3000,
                    name: "web",
                    securityContext: { ensureNonRoot: false },
                },
            ],
            initContainers: [
                {
                    image: "postgres:13-alpine",
                    command: ["createdb", "squid"],
                    name: "createdb",
                    securityContext: { ensureNonRoot: false },
                    envVariables: {
                        PGPASSWORD: databaseSecret.envValue("PGPASSWORD"),
                    },
                    envFrom: [new EnvFrom(databaseConfigMap)],
                },
            ],
            replicas: 1,
        });

        const explorerService = deployment.exposeViaService({
            name: "explorer",
            ports: [{ port: 3000 }],
        });
        const apiService = deployment.exposeViaService({
            name: "explorer-api",
            ports: [{ port: 4350 }],
        });
        Object.entries({
            ...labels,
            "app.kubernetes.io/name": "rollups-explorer",
        }).forEach(([key, value]) =>
            explorerService.metadata.addLabel(key, value)
        );
        Object.entries({
            ...labels,
            "app.kubernetes.io/name": "rollups-explorer-api",
        }).forEach(([key, value]) => apiService.metadata.addLabel(key, value));

        /*
        explorerService.exposeViaIngress("/explorer");
        const apiIngress = apiService.exposeViaIngress("/api");
        apiIngress.metadata.addAnnotation(
            "traefik.ingress.kubernetes.io/router.middlewares",
            "rm"
        );
        apiIngress.metadata.addAnnotation(
            "traefik.http.middlewares.rm.replacepathregex.regex",
            "^/api/(.*)"
        );
        apiIngress.metadata.addAnnotation(
            "traefik.http.middlewares.rm.replacepathregex.replacement",
            "/$1"
        );*/

        new Middleware(this, "explorer-api-middleware", {
            metadata: {
                name: "rm",
                labels,
            },
            spec: {
                replacePathRegex: {
                    regex: "^/explorer-api/(.*)",
                    replacement: "/$1",
                },
            },
        });
        new IngressRoute(this, "explorer-ingress", {
            metadata: { labels },
            spec: {
                routes: [
                    {
                        kind: IngressRouteSpecRoutesKind.RULE,
                        match: 'PathPrefix("/explorer")',
                        services: [
                            {
                                name: explorerService.name,
                                port: IngressRouteSpecRoutesServicesPort.fromNumber(
                                    explorerService.port
                                ),
                            },
                        ],
                    },
                ],
            },
        });
        new IngressRoute(this, "explorer-api-ingress", {
            metadata: { labels },
            spec: {
                routes: [
                    {
                        kind: IngressRouteSpecRoutesKind.RULE,
                        match: 'PathPrefix("/explorer-api")',
                        services: [
                            {
                                name: apiService.name,
                                port: IngressRouteSpecRoutesServicesPort.fromNumber(
                                    apiService.port
                                ),
                            },
                        ],
                        middlewares: [
                            {
                                name: "rm",
                            },
                        ],
                    },
                ],
            },
        });
    }
}
