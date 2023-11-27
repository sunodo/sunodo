import { Construct } from "constructs";
import { Chart, ChartProps } from "cdk8s";
import { ConfigMap } from "cdk8s-plus-27";

import { Anvil } from "./anvil.js";
import { Explorer } from "./explorer.js";
import { Redis } from "./redis.js";
import { Ipfs } from "./ipfs.js";
import { Postgres } from "./postgres.js";
import { Traefik } from "./traefik.js";

type Env = {
    [name: string]: string;
};

export interface SunodoProps extends ChartProps {
    chainId?: number;
    databaseUrl?: string;
    epochDuration: number;
    explorer: boolean;
    injectedEnv: Env;
    redisUrl?: string;
    rpcUrl?: string;
    traefik: boolean;
    wsUrl?: string;
}

export class Sunodo extends Chart {
    constructor(scope: Construct, id: string, props: SunodoProps) {
        super(scope, id, props);
        let {
            chainId,
            databaseUrl,
            epochDuration,
            redisUrl,
            rpcUrl,
            traefik,
            wsUrl,
        } = props;

        if (!rpcUrl || !wsUrl || !chainId) {
            // create web3 provider chart
            const provider = new Anvil(this, "provider", {});
            chainId = 31337;
            rpcUrl = `http://${provider.service.name}:${provider.service.port}`;
            wsUrl = `ws://${provider.service.name}:${provider.service.port}`;
        }

        if (!redisUrl) {
            // create redis instance chart
            const redis = new Redis(this, "redis", {
                namespace: props.namespace,
            });
            redisUrl = `redis://${redis.service.name}:${redis.service.port}`;
            // XXX: cluster support
        }

        new ConfigMap(this, "database-config", {
            data: {
                DATABASE_URL: databaseUrl ?? "",
            },
        });

        // XXX: add conditionals?
        new Ipfs(this, "ipfs", { expose: true });

        if (traefik) {
            new Traefik(this, "traefik", { port: 8080 });
        }

        // create config map for other services
        // DAPP_CONTRACT_ADDRESS_FILE=/usr/share/sunodo/dapp.json
        const config = new ConfigMap(this, "sunodo-config", {
            data: {
                GRAPHQL_HOST: "0.0.0.0",
                GRAPHQL_PORT: "4000",
                INSPECT_SERVER_ADDRESS: "0.0.0.0:5005",
                REDIS_ENDPOINT: redisUrl!,
                // REDIS_CLUSTER_ENDPOINTS: "", // XXX: redis cluster support
                REMOTE_CARTESI_MACHINE_LOG_LEVEL: "info",
                SC_GRPC_ENDPOINT: "http://127.0.0.1:50051",
                SESSION_ID: "default_session_id",
                SERVER_MANAGER_ADDRESS: "127.0.0.1:5001",
                SERVER_MANAGER_ENDPOINT: "http://127.0.0.1:5001",
                SERVER_MANAGER_LOG_LEVEL: "info",
                SNAPSHOT_DIR: "/var/opt/cartesi/machine-snapshots",
                SNAPSHOT_LATEST: "/var/opt/cartesi/machine-snapshots/latest",
            },
        });
        const confirmations = 1; // XXX: depend on chain
        const walletConfig = new ConfigMap(this, "wallet-config", {
            data: {
                // AUTH_MNEMONIC="test test test test test test test test test test test junk"
                // RD_DAPP_DEPLOYMENT_FILE=/usr/share/sunodo/dapp.json
                // RD_ROLLUPS_DEPLOYMENT_FILE=/usr/share/sunodo/localhost.json
            },
        });

        // sunodo start --rpc-url http://sepolia.infura.io/v3/...
        // sunodo start --rpc-url http://mainnet.infura.io/v3/... --namespace mainnet
        // > error: stop sunodo first, or run --namespace <other>
        const chainConfig = new ConfigMap(this, "chain-config", {
            data: {
                BH_HTTP_ENDPOINT: rpcUrl,
                BH_WS_ENDPOINT: wsUrl,
                BH_BLOCK_TIMEOUT: "8", // XXX: depends on network
                CHAIN_ID: chainId.toString(), // XXX: possibly use chain id of provided provider
                PROVIDER_HTTP_ENDPOINT: rpcUrl,
                PROVIDER_WS_ENDPOINT: wsUrl,
                RD_EPOCH_DURATION: epochDuration.toString(),
                SC_DEFAULT_CONFIRMATIONS: confirmations.toString(),
                SF_GENESIS_BLOCK: "1", // XXX: depends on network
                SF_SAFETY_MARGIN: "1", // XXX: depends on network
                TX_CHAIN_ID: chainId.toString(), // XXX: possibly use chain id of provided provider
                TX_CHAIN_IS_LEGACY: "false", // XXX: do we still need to expose this?
                TX_DEFAULT_CONFIRMATIONS: (confirmations + 1).toString(),
                TX_PROVIDER_HTTP_ENDPOINT: rpcUrl,
            },
        });

        if (Object.keys(props.injectedEnv).length > 0) {
            // loaded .env, create configMap with that
            new ConfigMap(this, "dotenv-config", { data: props.injectedEnv });
        }

        if (!databaseUrl) {
            // create a test database
            const postgres = new Postgres(this, "postgres", {
                password: "password",
            });
            if (props.explorer) {
                new Explorer(this, "explorer", {
                    providerConfigMap: chainConfig,
                    databaseConfigMap: postgres.config,
                    databaseSecret: postgres.secret,
                });
            }
        }

        // XXX: operator deployment
        // cmd: ["sunodo-operator", "--chain-config-name", chainConfig.name]
    }
}
