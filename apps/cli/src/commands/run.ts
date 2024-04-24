import { Flags } from "@oclif/core";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";

import { BaseCommand } from "../baseCommand.js";

export default class Run extends BaseCommand<typeof Run> {
    static summary = "Run application node.";

    static description = "Run a local cartesi node for the application.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = {
        "block-time": Flags.integer({
            description: "interval between blocks (in seconds)",
            default: 5,
        }),
        "epoch-duration": Flags.integer({
            description: "duration of an epoch (in seconds)",
            default: 3600,
        }),
        "no-backend": Flags.boolean({
            description:
                "Run a node without the application code. Application must be executed by the developer on the host machine, fetching inputs from the node running at http://localhost:5004",
            summary: "run a node without the application code",
            default: false,
        }),
        verbose: Flags.boolean({
            description: "verbose output",
            default: false,
            char: "v",
        }),
        "listen-port": Flags.integer({
            description: "port to listen for incoming connections",
            default: 8080,
        }),
    };

    public async run(): Promise<void> {
        const { flags } = await this.parse(Run);
        let projectName: string;

        if (flags["no-backend"]) {
            projectName = "sunodo-node";
        } else {
            // get machine hash
            const hash = this.getMachineHash();
            // Check if snapshot exists
            if (!hash) {
                throw new Error(
                    `Cartesi machine snapshot not found, run '${this.config.bin} build'`,
                );
            }
            projectName = hash.substring(2, 10);
        }

        // path of the tool instalation
        const binPath = path.join(
            path.dirname(new URL(import.meta.url).pathname),
            "..",
        );

        // setup the environment variable used in docker compose
        const blockInterval = flags["block-time"];
        const epochDuration = flags["epoch-duration"];
        const listenPort = flags["listen-port"];
        const env: NodeJS.ProcessEnv = {
            ANVIL_VERBOSITY: flags.verbose ? "--steps-tracing" : "--silent",
            BLOCK_TIME: blockInterval.toString(),
            BLOCK_TIMEOUT: (blockInterval + 3).toString(),
            CARTESI_EPOCH_DURATION: epochDuration.toString(),
            CARTESI_EXPERIMENTAL_DISABLE_CONFIG_LOG: flags.verbose
                ? "false"
                : "true",
            CARTESI_EXPERIMENTAL_SERVER_MANAGER_BYPASS_LOG: flags.verbose
                ? "false"
                : "true",
            CARTESI_LOG_LEVEL: flags.verbose ? "info" : "error",
            CARTESI_SNAPSHOT_DIR: "/usr/share/rollups-node/snapshot",
            SUNODO_BIN_PATH: binPath,
            SUNODO_LISTEN_PORT: listenPort.toString(),
        };

        // validator
        const composeFiles = ["docker-compose-validator.yaml"];

        // prompt
        composeFiles.push("docker-compose-prompt.yaml");

        // database
        composeFiles.push("docker-compose-database.yaml");

        // proxy
        composeFiles.push("docker-compose-proxy.yaml");

        // anvil
        composeFiles.push("docker-compose-anvil.yaml");

        // explorer
        composeFiles.push("docker-compose-explorer.yaml");

        // load the no-backend compose file
        if (flags["no-backend"]) {
            composeFiles.push("docker-compose-host.yaml");
        } else {
            // snapshot volume
            composeFiles.push("docker-compose-snapshot-volume.yaml");
        }

        // add project env file loading
        if (fs.existsSync("./.sunodo.env")) {
            composeFiles.push("docker-compose-envfile.yaml");
        }

        // create the "--file <file>" list
        const files = composeFiles
            .map((f) => ["--file", path.join(binPath, "node", f)])
            .flat();

        const compose_args = [
            "compose",
            ...files,
            "--project-directory",
            ".",
            "--project-name",
            projectName,
        ];

        const up_args = [];

        if (!flags.verbose) {
            compose_args.push("--progress", "quiet");
            up_args.push("--attach", "validator");
            up_args.push("--attach", "prompt");
        }

        // XXX: need this handler, so SIGINT can still call the finally block below
        process.on("SIGINT", () => {});

        try {
            // run compose environment
            await execa("docker", [...compose_args, "up", ...up_args], {
                env,
                stdio: "inherit",
            });
        } catch (e: unknown) {
            // 130 is a graceful shutdown, so we can swallow it
            if ((e as any).exitCode !== 130) {
                throw e;
            }
        } finally {
            // shut it down, including volumes
            await execa("docker", [...compose_args, "down", "--volumes"], {
                env,
                stdio: "inherit",
            });
        }
    }
}
