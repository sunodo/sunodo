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

        const statefulSet = new StatefulSet(this, "statefulSet", {
            replicas: 1,
            serviceAccount,
            securityContext: { fsGroup: 1001 },
        });

        const container = statefulSet.addContainer({
            image: "docker.io/bitnami/redis:7.2.2-debian-11-r0",
            securityContext: {
                user: 1001,
                group: 0,
            },
            command: ["/bin/bash"],
            args: ["-c", "/opt/bitnami/scripts/start-scripts/start-master.sh"],
            envVariables: {
                BITNAMI_DEBUG: EnvValue.fromValue("false"),
                REDIS_REPLICATION_MODE: EnvValue.fromValue("master"),
                ALLOW_EMPTY_PASSWORD: EnvValue.fromValue("yes"),
                REDIS_TLS_ENABLED: EnvValue.fromValue("no"),
                REDIS_PORT: EnvValue.fromValue("6379"),
            },
            portNumber: 6379,
            liveness: Probe.fromCommand(
                ["sh", "-c", "/health/ping_liveness_local.sh", "5"],
                {
                    failureThreshold: 5,
                    initialDelaySeconds: Duration.seconds(20),
                    periodSeconds: Duration.seconds(5),
                    timeoutSeconds: Duration.seconds(6),
                }
            ),
            readiness: Probe.fromCommand(
                ["sh", "-c", "/health/ping_readiness_local.sh", "1"],
                {
                    failureThreshold: 5,
                    initialDelaySeconds: Duration.seconds(20),
                    periodSeconds: Duration.seconds(5),
                    timeoutSeconds: Duration.seconds(2),
                }
            ),
        });

        container.mount(
            "/opt/bitnami/scripts/start-scripts",
            Volume.fromConfigMap(this, "scripts", scripts, {
                defaultMode: 0o0755,
            })
        );
        container.mount(
            "/health",
            Volume.fromConfigMap(this, "health", health, {
                defaultMode: 0o0755,
            })
        );
        container.mount(
            "/opt/bitnami/redis/mounted-etc",
            Volume.fromConfigMap(this, "config", config)
        );
        container.mount(
            "/opt/bitnami/redis/etc/",
            Volume.fromEmptyDir(this, "redis-tmp-conf", "redis-tmp-conf")
        );
        container.mount("/tmp", Volume.fromEmptyDir(this, "tmp", "tmp"));

        // create the storage request
        const claim = new PersistentVolumeClaim(this, "claim", {
            storage: Size.mebibytes(50), // 50Mi should be enough?
            accessModes: [PersistentVolumeAccessMode.READ_WRITE_ONCE],
        });
        container.mount(
            "/data",
            Volume.fromPersistentVolumeClaim(this, "pvc", claim)
        );

        /*const service = new Service(this, "service");
        service.select(statefulSet.toPodSelector()!);
        service.bind(6379, { targetPort: 6379 });
        this.service = service;*/
        this.service = statefulSet.service;
    }
}
