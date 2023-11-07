import { Construct } from "constructs";
import { Chart, ChartProps, Duration, Size } from "cdk8s";
import {
    ConfigMap,
    EnvValue,
    PersistentVolumeClaim,
    PersistentVolumeAccessMode,
    Probe,
    Service,
    ServiceAccount,
    StatefulSet,
    Volume,
} from "cdk8s-plus-27";
import path from "path";

export interface RedisChartProps extends ChartProps {}

export class RedisChart extends Chart {
    public readonly service: Service;

    constructor(scope: Construct, id: string, props: RedisChartProps) {
        super(scope, id, props);

        // service account
        const serviceAccount = new ServiceAccount(this, "service-account", {
            automountToken: true,
        });

        // redis configuration
        const config = new ConfigMap(this, "config");
        config.addDirectory(
            path.join(
                path.dirname(new URL(import.meta.url).pathname),
                "redis",
                "config"
            )
        );

        // redis health scripts
        const health = new ConfigMap(this, "health");
        health.addDirectory(
            path.join(
                path.dirname(new URL(import.meta.url).pathname),
                "redis",
                "health"
            )
        );

        // redis start scripts
        const scripts = new ConfigMap(this, "scripts");
        scripts.addDirectory(
            path.join(
                path.dirname(new URL(import.meta.url).pathname),
                "redis",
                "scripts"
            )
        );

        // create the storage request
        const claim = new PersistentVolumeClaim(this, "claim", {
            storage: Size.gibibytes(1),
            accessModes: [PersistentVolumeAccessMode.READ_WRITE_ONCE],
        });

        const volumeMounts = [
            {
                path: "/opt/bitnami/scripts/start-scripts",
                volume: Volume.fromConfigMap(this, "scripts-volume", scripts, {
                    defaultMode: 0o0755,
                }),
            },
            {
                path: "/health",
                volume: Volume.fromConfigMap(this, "health-volume", health, {
                    defaultMode: 0o0755,
                }),
            },
            {
                path: "/opt/bitnami/redis/mounted-etc",
                volume: Volume.fromConfigMap(this, "config-volume", config),
            },
            {
                path: "/opt/bitnami/redis/etc/",
                volume: Volume.fromEmptyDir(
                    this,
                    "redis-tmp-conf",
                    "redis-tmp-conf"
                ),
            },
            {
                path: "/tmp",
                volume: Volume.fromEmptyDir(this, "tmp", "tmp"),
            },
            {
                path: "/data",
                volume: Volume.fromPersistentVolumeClaim(this, "pvc", claim),
            },
        ];

        const statefulSet = new StatefulSet(this, "statefulSet", {
            replicas: 1,
            serviceAccount,
            securityContext: { fsGroup: 1001 },
            containers: [
                {
                    image: "docker.io/bitnami/redis:7.2.2-debian-11-r0",
                    portNumber: 6379,
                    securityContext: {
                        user: 1001,
                        group: 0,
                    },
                    command: ["/bin/bash"],
                    args: [
                        "-c",
                        "/opt/bitnami/scripts/start-scripts/start-master.sh",
                    ],
                    envVariables: {
                        BITNAMI_DEBUG: EnvValue.fromValue("false"),
                        REDIS_REPLICATION_MODE: EnvValue.fromValue("master"),
                        ALLOW_EMPTY_PASSWORD: EnvValue.fromValue("yes"),
                        REDIS_TLS_ENABLED: EnvValue.fromValue("no"),
                        REDIS_PORT: EnvValue.fromValue("6379"),
                    },
                    liveness: Probe.fromCommand(
                        ["sh", "-c", "/health/ping_liveness_local.sh 5"],
                        {
                            failureThreshold: 5,
                            initialDelaySeconds: Duration.seconds(20),
                            periodSeconds: Duration.seconds(5),
                            timeoutSeconds: Duration.seconds(6),
                        }
                    ),
                    readiness: Probe.fromCommand(
                        ["sh", "-c", "/health/ping_readiness_local.sh 1"],
                        {
                            failureThreshold: 5,
                            initialDelaySeconds: Duration.seconds(20),
                            periodSeconds: Duration.seconds(5),
                            timeoutSeconds: Duration.seconds(2),
                        }
                    ),
                    volumeMounts,
                },
            ],
        });

        this.service = statefulSet.service;
    }
}
