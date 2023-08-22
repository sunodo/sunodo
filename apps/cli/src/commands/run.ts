import { Command, Flags } from "@oclif/core";
import path from "path";
import fs from "fs-extra";
import { execa } from "execa";
import { DEFAULT_DEVNET_MNEMONIC } from "../wallet.js";

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
        verbose: Flags.boolean({
            description: "verbose output",
            default: false,
            char: "v",
        }),
    };

    public async run(): Promise<void> {
        const { flags } = await this.parse(Run);
        const snapshot = path.join(".sunodo", "image");

        // check if snapshot exists
        if (!fs.existsSync(snapshot) || !fs.statSync(snapshot).isDirectory()) {
            throw new Error(
                "Cartesi machine snapshot not found, run 'sunodo build'"
            );
        }

        // read hash of the cartesi machine snapshot
        const hash = fs
            .readFileSync(path.join(snapshot, "hash"))
            .toString("hex");
        const projectName = hash.substring(0, 8);

        // setup the environment variable used in docker compose
        const blockInterval = flags["block-time"];
        const epochDuration = flags["epoch-duration"];
        const env: NodeJS.ProcessEnv = {
            ANVIL_VERBOSITY: flags.verbose ? "--steps-tracing" : "--silent",
            BLOCK_TIME: blockInterval.toString(),
            BLOCK_TIMEOUT: (blockInterval + 3).toString(),
            CHAIN_ID: "31337",
            EPOCH_DURATION: epochDuration.toString(),
            MNEMONIC: DEFAULT_DEVNET_MNEMONIC,
            REDIS_LOG_LEVEL: flags.verbose ? "verbose" : "warning",
            RUST_LOG: flags.verbose ? "info" : "error",
            RPC_URL: "http://anvil:8545",
            S6_VERBOSITY: flags.verbose ? "2" : "0",
            SERVER_MANAGER_LOG_LEVEL: flags.verbose ? "info" : "error",
            WS_URL: "ws://anvil:8545",
        };

        // resolve compose file location based on version
        const composeFile = path.join(
            path.dirname(new URL(import.meta.url).pathname),
            "..",
            "node",
            "docker-compose-dev.yml"
        );

        const args = [
            "compose",
            "--file",
            composeFile,
            "--project-directory",
            ".",
            "--project-name",
            projectName,
        ];
        const attachment = flags.verbose ? [] : ["--attach", "validator"];

        // XXX: need this handler, so SIGINT can still call the finally block below
        process.on("SIGINT", () => {});

        try {
            // run compose environment
            await execa("docker", [...args, "up", ...attachment], {
                env,
                stdio: "inherit",
            });
        } finally {
            // shut it down, including volumes
            await execa("docker", [...args, "down", "--volumes"], {
                stdio: "inherit",
            });
        }
    }
}
