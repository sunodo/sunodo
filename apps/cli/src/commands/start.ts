import { Command, Flags } from "@oclif/core";
import k8s, {
    KubernetesObject,
    V1EndpointSliceList,
} from "@kubernetes/client-node";
import { App } from "cdk8s";
import dotenv from "dotenv";
import fs from "fs";
import { DefaultRenderer, Listr, ListrTaskWrapper } from "listr2";
import path from "path";
import pRetry from "p-retry";
import { createPublicClient, http } from "viem";

import { apply, findServicesByLabel, isServiceReady } from "../k8s/index.js";
import { supportedChains } from "../wallet.js";
import { Anvil } from "../k8s/anvil.js";
import { foundry } from "viem/chains";

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
        namespace: Flags.string({
            summary: "kubernetes namespace",
            description: "Install sunodo services into this namespace.",
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

    private async resolveChain(rpcUrl?: string, wsUrl?: string) {
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

        const chain = await this.resolveChain(
            flags["rpc-url"],
            flags["ws-url"]
        );

        // define namespace according to chain, unless explicitly defined
        // i.e. sunodo-31337 | sunodo-1 | sunodo-11155111
        const namespace = flags.namespace ?? `sunodo-${chain.id}`;

        // create k8s api clients
        const objectApi = kc.makeApiClient(k8s.KubernetesObjectApi);
        const coreApi = kc.makeApiClient(k8s.CoreV1Api);
        const discoveryApi = kc.makeApiClient(k8s.DiscoveryV1Api);

        // load .env to inject into a configMap
        const env = {};
        dotenv.config({ processEnv: env });

        // create namespace, if needed
        try {
            await coreApi.readNamespace(namespace);
        } catch (e) {
            await coreApi.createNamespace({ metadata: { name: namespace } });
        }

        // base directory of k8s files
        const base = path.join(
            path.dirname(new URL(import.meta.url).pathname),
            "..",
            "k8s"
        );

        const servicesReady = async (serviceNames: string[]) => {
            await pRetry((attemptCount) =>
                Promise.all(
                    serviceNames.map(async (serviceName) => {
                        // check if service is ready by querying its endpointSlices
                        const { body: endpoints } =
                            await discoveryApi.listNamespacedEndpointSlice(
                                namespace,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                `kubernetes.io/service-name=${serviceName}`
                            );
                        if (!isServiceReady(endpoints)) {
                            // service is not ready, raise error which triggers retry of pRetry
                            throw new Error(`Service ${serviceName} not ready`);
                        }
                    })
                )
            );
        };

        const applyApp = async (
            app: App,
            task: ListrTaskWrapper<any, typeof DefaultRenderer, any>
        ) => {
            const specString = app.synthYaml();
            const objects = await apply(objectApi, specString, namespace);

            // get names of services among all objects created
            const serviceNames = objects
                .filter((object) => object.kind === "Service")
                .map((service) => service.metadata?.name!);
            task.output = `Waiting for service(s) ${serviceNames.join(",")}...`;
            await servicesReady(serviceNames);
        };

        const applyDirectory = async (
            directory: string,
            task: ListrTaskWrapper<any, typeof DefaultRenderer, any>
        ): Promise<KubernetesObject[]> => {
            // traverse directory
            const entries = fs.readdirSync(directory, {
                encoding: "utf8",
                withFileTypes: true,
                recursive: true,
            });

            // get list of files only
            const files = entries
                .filter((entry) => entry.isFile())
                .map((entry) => path.join(entry.path, entry.name));

            // apply templates, returns all objects created
            const created = [];
            for (const filename of files) {
                task.output = `Applying ${filename}`;
                const specString = fs.readFileSync(filename, {
                    encoding: "utf-8",
                });
                const objects = await apply(objectApi, specString, namespace);
                created.push(...objects);
            }

            // get names of services among all objects created
            const serviceNames = created
                .filter((object) => object.kind === "Service")
                .map((service) => service.metadata?.name!);

            // await until services are ready (they have endpointSlices)
            task.output = `Waiting for service(s) ${serviceNames.join(",")}...`;
            await servicesReady(serviceNames);
            return created;
        };

        // create the task runner context, to be used after tasks are executed
        type Context = {
            rcpUrl?: string;
            wsUrl?: string;
            redisUrl?: string;
        };
        const ctx: Context = {
            rcpUrl: flags["rpc-url"],
            wsUrl: flags["ws-url"],
            redisUrl: flags["redis-url"],
        };

        // paralled tasks
        const tasks = new Listr([], { concurrent: true, ctx });

        if (!ctx.rcpUrl || !ctx.wsUrl) {
            // create an anvil instance
            tasks.add([
                {
                    title: "Starting anvil...",
                    task: async (ctx, task) => {
                        const app = new App();
                        const anvil = new Anvil(app, "anvil", {
                            namespace,
                        });
                        await applyApp(app, task);
                        task.title = "Anvil started";

                        // fill out the urls with the internal k8s service name (DNS resolution)
                        ctx.rcpUrl = `http://${anvil.service.name}:${anvil.service.port}`;
                        ctx.wsUrl = `ws://${anvil.service.name}:${anvil.service.port}`;
                    },
                },
            ]);
        }

        tasks.add([
            {
                title: "Starting router...",
                task: async (_ctx, task) => {
                    await applyDirectory(
                        path.join(base, "traefik", "crds"),
                        task
                    );
                    await applyDirectory(
                        path.join(base, "traefik", "templates"),
                        task
                    );
                    task.title = "Router started";
                },
            },
        ]);

        tasks.add([
            {
                title: "Starting postgres...",
                task: async (_ctx, task) => {
                    await applyDirectory(
                        path.join(base, "postgresql", "templates"),
                        task
                    );
                    task.title = "Postgres started";
                },
            },
        ]);

        if (!ctx.redisUrl) {
            tasks.add([
                {
                    title: "Starting redis...",
                    task: async (ctx, task) => {
                        const objects = await applyDirectory(
                            path.join(base, "redis", "templates"),
                            task
                        );
                        const services = findServicesByLabel(objects, {
                            "app.kubernetes.io/instance": "redis",
                            "app.kubernetes.io/component": "master",
                        });
                        if (services) {
                            const service = services[0];
                            const serviceName = service.metadata?.name!;
                            const servicePort = 6379; // XXX: read the spec
                            ctx.redisUrl = `redis://${serviceName}:${servicePort}`;
                        }
                        task.title = "Redis started";
                    },
                },
            ]);
        }
        await tasks.run();

        console.log(ctx);

        /*
        const app = new App();

        // create infrastructure chart
        new SunodoChart(app, "sunodo", {
            namespace,
            injectedEnv: env,
            redisUrl: flags["redis-url"],
            rpcUrl: flags["rpc-url"],
            wsUrl: flags["ws-url"],
        });

        this.log(app.synthYaml());
        */
    }
}
