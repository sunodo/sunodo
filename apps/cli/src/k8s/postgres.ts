import { Chart, ChartProps } from "cdk8s";
import {
    ConfigMap,
    IConfigMap,
    Probe,
    Secret,
    Service,
    StatefulSet,
} from "cdk8s-plus-27";
import { Construct } from "constructs";

export interface PostgresProps extends ChartProps {
    password: string;
}

export class Postgres extends Chart {
    public readonly service: Service;
    public readonly config: IConfigMap;
    public readonly secret: Secret;

    constructor(scope: Construct, id: string, props: PostgresProps) {
        super(scope, id, props);

        const labels = {
            "app.kubernetes.io/name": "postgres",
            "app.kubernetes.io/instance": "postgres",
            "app.kubernetes.io/version": "13",
            "app.kubernetes.io/component": "database",
            "app.kubernetes.io/part-of": "sunodo",
            "app.kubernetes.io/managed-by": "sunodo-cli",
        };

        const secret = new Secret(this, "secret", {
            metadata: { labels },
            stringData: {
                PGPASSWORD: props.password,
            },
        });

        // create deployment with devnet Docker image
        const statefulSet = new StatefulSet(this, "statefulSet", {
            metadata: { labels },
            containers: [
                {
                    image: "postgres:13-alpine",
                    portNumber: 5432,
                    readiness: Probe.fromCommand(["pg_isready"]),
                    securityContext: {
                        ensureNonRoot: false,
                        readOnlyRootFilesystem: false,
                    }, // we should run as non-root
                    envVariables: {
                        POSTGRES_PASSWORD: secret.envValue("PGPASSWORD"),
                    },
                },
            ],
            replicas: 1,
        });

        this.config = new ConfigMap(this, "config", {
            metadata: { labels },
            data: {
                PGPORT: "5432",
                PGHOST: statefulSet.service.name,
                PGUSER: "postgres",
                PGDATABASE: "postgres",
            },
        });

        this.service = statefulSet.service;
        this.secret = secret;
    }
}
