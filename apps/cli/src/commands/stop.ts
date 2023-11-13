import k8s from "@kubernetes/client-node";
import { Command, Flags } from "@oclif/core";
import { Listr } from "listr2";

import { delete_ } from "../k8s/index.js";
import { App } from "cdk8s";
import { Sunodo } from "../k8s/sunodo.js";

export default class Stop extends Command {
    static description = "Stop the sunodo server";

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
            description: "Delete sunodo services from this namespace.",
            default: "default",
        }),
    };

    public async run(): Promise<void> {
        const { flags } = await this.parse(Stop);

        // connect to k8s
        const kc = new k8s.KubeConfig();
        if (flags["cluster-config-file"]) {
            kc.loadFromFile(flags["cluster-config-file"]);
        } else if (flags["cluster-config"]) {
            kc.loadFromString(flags["cluster-config"]);
        } else {
            kc.loadFromDefault();
        }

        // namespace is required in this case
        const namespace = flags.namespace;

        // create k8s api clients
        const objectApi = kc.makeApiClient(k8s.KubernetesObjectApi);

        const app = new App();
        new Sunodo(app, "sunodo", {
            epochDuration: 0,
            explorer: true,
            injectedEnv: {},
            namespace,
            traefik: true,
        });

        const tasks = new Listr([], { concurrent: true });
        tasks.add([
            {
                title: "Stopping sunodo...",
                task: async (_ctx, task) => {
                    // XXX: delete all resources by searching for sunodo label instead
                    const specString = app.synthYaml();
                    await delete_(objectApi, specString, namespace);
                    task.title = "Sunodo stopped";
                },
            },
        ]);
        await tasks.run();
    }
}
