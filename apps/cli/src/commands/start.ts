import { Command, Flags } from "@oclif/core";
import k8s from "@kubernetes/client-node";
import { App } from "cdk8s";
import dotenv from "dotenv";

import { SunodoChart } from "../k8s/sunodo.js";

export default class Start extends Command {
    static description = "Start a sunodo node in the background";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static args = {};

    static flags = {
        "cluster-config": Flags.string({
            description: "kubernetes cluster config string",
        }),
        "cluster-config-file": Flags.file({
            description: "path of kubernetes cluster config file",
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
        const namespace = "default";
        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

        const app = new App();

        // load .env to inject into a configMap
        const env = {};
        dotenv.config({ processEnv: env });

        // create infrastructure chart
        new SunodoChart(app, "sunodo", {
            namespace,
            injectedEnv: env,
            redisUrl: flags["redis-url"],
            rpcUrl: flags["rpc-url"],
            wsUrl: flags["ws-url"],
        });

        this.log(app.synthYaml());
    }
}
