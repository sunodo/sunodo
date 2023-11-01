import { Args, Command, Flags } from "@oclif/core";
import path from "path";
import { execa } from "execa";
import fs from "fs-extra";
import k8s from "@kubernetes/client-node";
import { App, Chart, ChartProps } from "cdk8s";
import { DatabaseChart } from "../k8s/database.js";
import { Web3ProviderChart } from "../k8s/provider.js";

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
        "rpc-url": Flags.string({
            description: "The RPC endpoint.",
            char: "r",
            env: "ETH_RPC_URL",
            helpGroup: "Ethereum",
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
        // new DatabaseChart(app, "sunodo", "nginx");

        // create web3 provider chart
        const provider = new Web3ProviderChart(app, "provider", {
            url: flags["rpc-url"],
        });

        app.synth();
        this.log(app.synthYaml());
    }
}
