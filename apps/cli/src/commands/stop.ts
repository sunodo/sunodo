import k8s from "@kubernetes/client-node";
import { Command, Flags } from "@oclif/core";
import fs from "fs";
import { DefaultRenderer, Listr, ListrTaskWrapper } from "listr2";
import path from "path";

import { delete_ } from "../k8s/index.js";

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
            required: true,
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

        // this.log(`Using kubernetes cluster '${kc.currentContext}'`);
        const deleteDirectory = async (
            directory: string,
            task: ListrTaskWrapper<any, typeof DefaultRenderer, any>
        ): Promise<void> => {
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
            for (const filename of files) {
                task.output = `Deleting ${filename}`;
                const specString = fs.readFileSync(filename, {
                    encoding: "utf-8",
                });
                await delete_(objectApi, specString, namespace);
            }
        };

        const base = path.join(
            path.dirname(new URL(import.meta.url).pathname),
            "..",
            "k8s"
        );

        const tasks = new Listr([], { concurrent: true });
        tasks.add([
            {
                title: "Stopping redis...",
                task: async (_ctx, task) => {
                    await deleteDirectory(
                        path.join(base, "redis", "templates"),
                        task
                    );
                    task.title = "Redis stopped";
                },
            },
        ]);
        tasks.add([
            {
                title: "Stopping postgres...",
                task: async (_ctx, task) => {
                    await deleteDirectory(
                        path.join(base, "postgresql", "templates"),
                        task
                    );
                    task.title = "Postgres stopped";
                },
            },
        ]);
        tasks.add([
            {
                title: "Stopping router...",
                task: async (_ctx, task) => {
                    await deleteDirectory(
                        path.join(base, "traefik", "templates"),
                        task
                    );
                    await deleteDirectory(
                        path.join(base, "traefik", "crds"),
                        task
                    );
                    task.title = "Router stopped";
                },
            },
        ]);

        await tasks.run();
    }
}
