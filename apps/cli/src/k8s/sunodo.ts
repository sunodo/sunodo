import { Construct } from "constructs";
import { Chart, ChartProps } from "cdk8s";
import { ConfigMap } from "cdk8s-plus-27";

import { AnvilChart } from "./anvil.js";

type Env = {
    [name: string]: string;
};

export interface SunodoChartProps extends ChartProps {
    databaseUrl?: string;
    epochDuration?: number;
    injectedEnv: Env;
    redisUrl?: string;
    rpcUrl?: string;
    wsUrl?: string;
}

export class SunodoChart extends Chart {
    constructor(scope: Construct, id: string, props: SunodoChartProps) {
        super(scope, id, props);
        let databaseUrl = props.databaseUrl;
        let redisUrl = props.redisUrl;
        let rpcUrl = props.rpcUrl;
        let wsUrl = props.wsUrl;
        const epochDuration = props.epochDuration ?? 86400;

        if (!rpcUrl || !wsUrl) {
            // create web3 provider chart
            const provider = new AnvilChart(this, "provider", {});
            rpcUrl = `http://${provider.service.name}:${provider.service.port}`;
            wsUrl = `ws://${provider.service.name}:${provider.service.port}`;
        }

        /*if (!redisUrl) {
            // create redis instance chart
            const redis = new RedisChart(this, "redis", {
                namespace: props.namespace,
            });
            redisUrl = `redis://${redis.service.name}:${redis.service.port}`;
            // XXX: cluster support
        }*/

        if (!databaseUrl) {
        }

        // create config map for other services
        // DAPP_CONTRACT_ADDRESS_FILE=/usr/share/sunodo/dapp.json
        const sharedConfig = new ConfigMap(this, "shared-config", {
            data: {
                REDIS_ENDPOINT: redisUrl!,
                // REDIS_CLUSTER_ENDPOINTS: "", // XXX: redis cluster support
                SESSION_ID: "default_session_id",
                CHAIN_ID: "31337", // XXX: possibly use chain id of provided provider
                TX_CHAIN_ID: "31337", // XXX: possibly use chain id of provided provider
                SERVER_MANAGER_ENDPOINT: "http://127.0.0.1:5001",
                SERVER_MANAGER_ADDRESS: "127.0.0.1:5001",
                SERVER_MANAGER_LOG_LEVEL: "info",
                REMOTE_CARTESI_MACHINE_LOG_LEVEL: "info",
            },
        });
        const confirmations = 1; // XXX: depend on chain
        const dispatcherConfig = new ConfigMap(this, "dispatcher-config", {
            data: {
                // AUTH_MNEMONIC="test test test test test test test test test test test junk"
                // RD_DAPP_DEPLOYMENT_FILE=/usr/share/sunodo/dapp.json
                // RD_ROLLUPS_DEPLOYMENT_FILE=/usr/share/sunodo/localhost.json
                RD_EPOCH_DURATION: epochDuration.toString(),
                SC_GRPC_ENDPOINT: "http://127.0.0.1:50051",
                SC_DEFAULT_CONFIRMATIONS: confirmations.toString(),
                TX_PROVIDER_HTTP_ENDPOINT: rpcUrl,
                TX_CHAIN_IS_LEGACY: "false", // XXX: do we still need to expose this?
                TX_DEFAULT_CONFIRMATIONS: (confirmations + 1).toString(),
            },
        });

        const stateServerConfig = new ConfigMap(this, "state-server-config", {
            data: {
                SF_GENESIS_BLOCK: "1",
                SF_SAFETY_MARGIN: "1",
                BH_HTTP_ENDPOINT: rpcUrl,
                BH_WS_ENDPOINT: wsUrl,
                BH_BLOCK_TIMEOUT: "8", // XXX: depends on network
            },
        });

        const advanceRunnerConfig = new ConfigMap(
            this,
            "advance-runner-config",
            {
                data: {
                    PROVIDER_HTTP_ENDPOINT: rpcUrl,
                    SNAPSHOT_DIR: "/var/opt/cartesi/machine-snapshots",
                    SNAPSHOT_LATEST:
                        "/var/opt/cartesi/machine-snapshots/latest",
                },
            }
        );

        const inspectServerConfig = new ConfigMap(
            this,
            "inspect-server-config",
            {
                data: {
                    INSPECT_SERVER_ADDRESS: "0.0.0.0:5005",
                },
            }
        );

        const graphqlServerConfig = new ConfigMap(
            this,
            "graphql-server-config",
            {
                data: {
                    GRAPHQL_HOST: "0.0.0.0",
                    GRAPHQL_PORT: "4000",
                },
            }
        );

        if (Object.keys(props.injectedEnv).length > 0) {
            // loaded .env, create configMap with that
            new ConfigMap(this, "dotenv-config", { data: props.injectedEnv });
        }
    }
}
