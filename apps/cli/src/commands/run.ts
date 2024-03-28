import { Command, Option } from "clipanion";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";

import { isPort, isPositiveNumber } from "../flags.js";
import { SunodoCommand } from "../sunodoCommand.js";

export default class Run extends SunodoCommand {
    static paths = [["run"]];

    static usage = Command.Usage({
        description: "Run application node.",
        details: "Run a local cartesi node for the application.",
    });

    blockTime = Option.String("--block-time", {
        description: "interval between blocks (in seconds)",
        validator: isPositiveNumber,
    });

    epochDuration = Option.String("--epoch-duration", {
        description: "duration of an epoch (in seconds)",
        validator: isPositiveNumber,
    });

    noBackend = Option.Boolean("--no-backend", {
        description: "run a node without the application code",
    });

    verbose = Option.Boolean("-v,--verbose", {
        description: "verbose output",
    });

    listenPort = Option.String("-p,--listen-port", {
        description: "port to listen for incoming connections",
        validator: isPort,
    });

    public async execute(): Promise<void> {
        let projectName: string;

        if (this.noBackend) {
            projectName = "sunodo-node";
        } else {
            // get machine hash
            const hash = this.getMachineHash();
            // Check if snapshot exists
            if (!hash) {
                throw new Error(
                    "Cartesi machine snapshot not found, run 'sunodo build'",
                );
            }
            projectName = hash.substring(2, 10);
        }

        // path of the sunodo instalation
        const binPath = path.join(
            path.dirname(new URL(import.meta.url).pathname),
            "..",
        );

        // setup the environment variable used in docker compose
        const blockInterval = this.blockTime ?? 5;
        const epochDuration = this.epochDuration ?? 3600;
        const listenPort = this.listenPort ?? 8080;
        const env: NodeJS.ProcessEnv = {
            ANVIL_VERBOSITY: this.verbose ? "--steps-tracing" : "--silent",
            BLOCK_TIME: blockInterval.toString(),
            BLOCK_TIMEOUT: (blockInterval + 3).toString(),
            CARTESI_EPOCH_DURATION: epochDuration.toString(),
            CARTESI_EXPERIMENTAL_DISABLE_CONFIG_LOG: this.verbose
                ? "false"
                : "true",
            CARTESI_EXPERIMENTAL_SERVER_MANAGER_BYPASS_LOG: this.verbose
                ? "false"
                : "true",
            CARTESI_LOG_LEVEL: this.verbose ? "info" : "error",
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
        if (this.noBackend) {
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

        if (!this.verbose) {
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
