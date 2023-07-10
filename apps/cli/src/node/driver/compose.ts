import path from "path";
import { Address } from "abitype";
import { execa } from "execa";
import { NodeDriver, NodeStatus } from "./index.js";

export class ComposeDriver implements NodeDriver {
    private nodes: Record<string, NodeStatus>;

    constructor() {
        this.nodes = {};
    }

    async start(
        chainId: number,
        address: Address,
        location: string
    ): Promise<NodeStatus> {
        console.log("starting", chainId, address);

        // resolve compose file location based on version
        const composeFile = path.join(
            path.dirname(new URL(import.meta.url).pathname),
            "..",
            "docker-compose.yml"
        );

        // XXX
        const projectName = address.substring(2, 10);
        const env = {};

        const args = [
            "compose",
            "--file",
            composeFile,
            "--project-directory",
            ".",
            "--project-name",
            projectName,
        ];
        const attachment = ["--attach", "validator"];

        // XXX: need this handler, so SIGINT can still call the finally block below
        process.on("SIGINT", () => {});

        // run compose environment
        await execa("docker", [...args, "up", ...attachment], {
            env,
            stdio: "inherit",
        });

        this.nodes[address] = "started";
        return "starting";
    }

    async stop(chainId: number, address: Address): Promise<NodeStatus> {
        console.log("stopping", chainId, address);
        this.nodes[address] = "stopped";
        return "stopping";
    }

    async getStatus(chainId: number, address: Address): Promise<NodeStatus> {
        console.log("status", chainId, address);
        return this.nodes[address] || "unknown";
    }

    async list(chainId: number): Promise<Address[]> {
        throw new Error("Method not implemented.");
    }
}
