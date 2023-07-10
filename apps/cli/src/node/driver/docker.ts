import path from "path";
import { Address } from "abitype";
import { execa } from "execa";
import { IPFSHTTPClient, create } from "kubo-rpc-client";
import tar from "tar-fs";
import zlib from "zlib";
import { Duplex } from "stream";

import { NodeDriver, NodeStatus } from "./index.js";

export class DockerDriver implements NodeDriver {
    private machineDir: string;
    private ipfs: IPFSHTTPClient;
    private nodes: Record<string, NodeStatus>;

    constructor(machineDir: string, ipfs: URL) {
        this.machineDir = machineDir;
        this.ipfs = create({ url: ipfs });
        this.nodes = {};
    }

    async downloadMachine(location: string, machineDir: string) {
        // pin the CID of the machine, so it's always available in the IPFS node
        await this.ipfs.pin.add(location);

        // download file from IPFS
        const content = this.ipfs.cat(location);
        const extract = tar.extract(machineDir);
        const gunzip = zlib.createGunzip();
        const stream = new Duplex();
        stream.push(content);
        stream.push(null);
        stream.pipe(gunzip).pipe(extract);
    }

    async start(address: Address, location: string): Promise<NodeStatus> {
        console.log("starting", address);

        await this.downloadMachine(
            location,
            path.join(this.machineDir, location)
        );

        // resolve compose file location based on version
        const composeFile = path.join(
            path.dirname(new URL(import.meta.url).pathname),
            "..",
            "docker-compose.yml"
        );

        // check hash?
        // create database with address as name
        // REDIS_ENDPOINT: attach to controller network
        // DATABASE: attach to controller network
        // DAPP_CONTRACT_ADDRESS: address
        // CHAIN_ID
        // RD_DAPP_DEPLOYMENT_FILE
        // RD_ROLLUPS_DEPLOYMENT_FILE
        // RD_EPOCH_DURATION: flag
        // SC_DEFAULT_CONFIRMATIONS: 1 ?
        // TX_MNEMONIC
        // BH_BLOCK_TIMEOUT
        // RPC_URL
        // WS_URL
        // SNAPSHOT_DIR: download machine using IPFS
        // SNAPSHOT_LATEST
        // SF_GENESIS_BLOCK: 0x1
        // traefik routing

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

    async stop(address: Address): Promise<NodeStatus> {
        console.log("stopping", address);
        this.nodes[address] = "stopped";
        return "stopping";
    }
}
