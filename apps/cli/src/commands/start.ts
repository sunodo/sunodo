import { Command, Flags } from "@oclif/core";
import k8s, { V1ObjectMeta } from "@kubernetes/client-node";
import { App } from "cdk8s";
import dotenv from "dotenv";
import { DefaultRenderer, Listr, ListrTaskWrapper } from "listr2";
import pRetry from "p-retry";
import { Chain, createPublicClient, http } from "viem";
import { foundry } from "viem/chains";

import { apply, isServiceReady } from "../k8s/index.js";
import { supportedChains } from "../wallet.js";
import { Sunodo } from "../k8s/sunodo.js";

export default class Start extends Command {
    static description = "Start a sunodo server";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static args = {};

    static flags = {
        "cluster-config": Flags.string({
            description: "kubernetes cluster config string",
        }),
        "cluster-config-file": Flags.file({
            description: "path of kubernetes cluster config file",
        }),
        "database-url": Flags.string({
            summary: "postgres database url",
            env: "PGURL",
            helpGroup: "Database",
        }),
        "database-host": Flags.string({
            summary: "postgres database host",
            helpGroup: "Database",
            env: "PGHOST",
            exclusive: ["database-url"],
        }),
        "database-port": Flags.integer({
            summary: "postgres database port",
            helpGroup: "Database",
            env: "PGPORT",
            exclusive: ["database-url"],
        }),
        "database-user": Flags.string({
            summary: "postgres database user",
            helpGroup: "Database",
            env: "PGUSER",
            exclusive: ["database-url"],
        }),
        "database-password": Flags.string({
            summary: "postgres database password",
            helpGroup: "Database",
            env: "PGPASSWORD",
            exclusive: ["database-url"],
        }),
        "database-db": Flags.string({
            summary: "postgres database name",
            helpGroup: "Database",
            env: "PGDATABASE",
            exclusive: ["database-url"],
        }),
        "epoch-duration": Flags.integer({
            description: "duration of an epoch (in seconds)",
            default: 86400,
        }),
        namespace: Flags.string({
            summary: "kubernetes namespace",
            description: "Install sunodo services into this namespace.",
            default: "default",
        }),
        "redis-url": Flags.string({
            description: "Redis endpoint.",
            env: "REDIS_URL",
        }),
        "rpc-url": Flags.string({
            description: "The Ethereum RPC endpoint.",
            env: "ETH_RPC_URL",
            helpGroup: "Ethereum",
            dependsOn: ["ws-url"],
        }),
        "ws-url": Flags.string({
            description: "The Ethereum Websocket endpoint.",
            env: "ETH_WS_URL",
            helpGroup: "Ethereum",
            dependsOn: ["rpc-url"],
        }),
    };

    private async resolveChain(
        rpcUrl?: string,
        wsUrl?: string,
    ): Promise<Chain> {
        if (rpcUrl && wsUrl) {
            // user provided web3 provider, create client
            const publicClient = createPublicClient({
                transport: http(rpcUrl),
            });

            // get list of supported chains
            const chains = supportedChains({ includeDevnet: true });

            // query the chain id
            const chainId = await publicClient.getChainId();

            // resolve to one of the supported chains
            const chain = chains.find((chain) => chain.id === chainId);
            if (!chain) {
                // throw an error if chain is not supported
                throw new Error(`Unsupported chain ${chainId}`);
            }
            return chain;
        } else {
            // no chain provided, will create a local anvil
            return foundry;
        }
    }

    public async run(): Promise<void> {
        const { flags } = await this.parse(Start);

        // connect to k8s
        const kc = new k8s.KubeConfig();
        if (flags["cluster-config-file"]) {
            kc.loadFromFile(flags["cluster-config-file"]);
        } else if (flags["cluster-config"]) {
            kc.loadFromString(flags["cluster-config"]);
        } else {
            kc.loadFromDefault();
        }

        // this.log(`Using kubernetes cluster '${kc.currentContext}'`);
        const namespace = flags.namespace;

        // resolve chain based on
        const chain = await this.resolveChain(
            flags["rpc-url"],
            flags["ws-url"],
        );

        // create k8s api clients
        const objectApi = kc.makeApiClient(k8s.KubernetesObjectApi);
        const discoveryApi = kc.makeApiClient(k8s.DiscoveryV1Api);

        // load .env to inject into a configMap
        const env = {};
        dotenv.config({ processEnv: env }); // XXX: load .sunodo.env instead?

        const serviceReady = async (service: V1ObjectMeta) => {
            // check if service is ready by querying its endpointSlices
            const { body: endpoints } =
                await discoveryApi.listNamespacedEndpointSlice(
                    service.namespace!,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    `kubernetes.io/service-name=${service.name}`,
                );
            if (!isServiceReady(endpoints)) {
                // service is not ready, raise error which triggers retry of pRetry
                throw new Error(`Service ${service.name} not ready`);
            }
        };

        // create the task runner context, to be used after tasks are executed
        type Context = {
            databaseUrl?: string;
            redisUrl?: string;
        };
        const ctx: Context = {
            databaseUrl: flags["database-url"],
            redisUrl: flags["redis-url"],
        };

        // paralled tasks
        const tasks = new Listr([], { concurrent: true, ctx });

        const serviceWaitTask = (service: V1ObjectMeta) => {
            const label = service.labels
                ? service.labels["app.kubernetes.io/name"] ?? service.name
                : service.name;
            return {
                title: `Waiting for service ${label}...`,
                task: async (
                    ctx: Context,
                    task: ListrTaskWrapper<
                        Context,
                        typeof DefaultRenderer,
                        any
                    >,
                ) => {
                    await pRetry((attemptCount) => serviceReady(service));
                    task.title = `Service ${service.name} ready`;
                },
            };
        };

        // create CDK app
        const app = new App();
        new Sunodo(app, "sunodo", {
            chainId: chain.id,
            epochDuration: flags["epoch-duration"],
            explorer: true,
            injectedEnv: env,
            namespace,
            rpcUrl: flags["rpc-url"],
            traefik: true,
            wsUrl: flags["ws-url"],
        });

        // create a sunodo instance
        tasks.add([
            {
                title: "Starting sunodo...",
                task: async (ctx, task) => {
                    const specString = app.synthYaml();
                    const objects = await apply(
                        objectApi,
                        specString,
                        namespace,
                    );

                    // get services among all objects created
                    const services = objects
                        .filter((object) => object.kind === "Service")
                        .map((service) => service.metadata!);

                    // create one subtask for each service we need to wait to be ready
                    return task.newListr(services.map(serviceWaitTask));
                },
            },
        ]);

        await tasks.run();
        console.log(ctx);
    }
}
