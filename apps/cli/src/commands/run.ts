import { Command, Flags } from "@oclif/core";
import { CLIWrapper } from "@sunodo/cli-wrapper";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";

export default class Run extends Command {
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
            default: 86400,
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
        const snapshot = path.join(".sunodo", "image");
        let projectName: string;
        let compose: CLIWrapper = new CLIWrapper();
        compose.allowSubCommand = true;

        if (flags["no-backend"]) {
            projectName = "sunodo-node";
        } else {
            // Check if snapshot exists
            if (
                !fs.existsSync(snapshot) ||
                !fs.statSync(snapshot).isDirectory()
            ) {
                throw new Error(
                    "Cartesi machine snapshot not found, run 'sunodo build'",
                );
            }

            // Read hash of the cartesi machine snapshot
            const hash = fs
                .readFileSync(path.join(snapshot, "hash"))
                .toString("hex");
            projectName = hash.substring(0, 8);
        }

        // path of the sunodo instalation
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
            RD_EPOCH_DURATION: epochDuration.toString(),
            REDIS_LOG_LEVEL: flags.verbose ? "verbose" : "warning",
            REMOTE_CARTESI_MACHINE_LOG_LEVEL: flags.verbose ? "info" : "error",
            RUST_LOG: flags.verbose ? "info" : "error",
            S6_VERBOSITY: flags.verbose ? "2" : "0",
            SERVER_MANAGER_LOG_LEVEL: flags.verbose ? "info" : "error",
            SUNODO_BIN_PATH: binPath,
            SUNODO_LISTEN_PORT: listenPort.toString(),
        };

        let composeProject = compose
            .withCmd("docker compose")
            .withArgs(["--project-directory", "."])
            .withArgs(["--project-name", projectName])
            .withArgs(["--file", "docker-compose-validator.yaml"])
            .withArgs(["--file", "docker-compose-prompt.yaml"])
            .withArgs(["--file", "docker-compose-database.yaml"])
            .withArgs(["--file", "docker-compose-proxy.yaml"])
            .withArgs(["--file", "docker-compose-anvil.yaml"])
            .withArgs(["--file", "docker-compose-explorer.yaml"]);

        // load the no-backend compose file
        if (flags["no-backend"]) {
            compose.withArgs(["--file", "docker-compose-host.yaml"]);
        } else {
            // snapshot volume
            compose.withArgs(["-file", "docker-compose-snapshot-volume.yaml"]);
        }

        // add project env file loading
        if (fs.existsSync("./.sunodo.env")) {
            compose.withArgs(["--file", "docker-compose-envfile.yaml"]);
        }

        let composeUp = composeProject;
        composeUp.withCmd("up");
        const attachment = flags.verbose
            ? []
            : composeUp.withArgs([
                  "--attach",
                  "validator",
                  "--attach",
                  "prompt",
              ]);

        // XXX: need this handler, so SIGINT can still call the finally block below
        process.on("SIGINT", () => {});

        try {
            // run compose environment
            await execa(composeUp.builtCmd(), {
                env,
                stdio: "inherit",
            });
        } catch (e: any) {
            // 130 is a graceful shutdown, so we can swallow it
            if (e.exitCode !== 130) {
                throw e;
            }
        } finally {
            // shut it down, including volumes
            let composeDown = composeProject;
            composeDown.withCmd("down").withArgs(["--volumes"]);
            await execa(composeDown.builtCmd(), {
                env,
                stdio: "inherit",
            });
        }
    }
}
