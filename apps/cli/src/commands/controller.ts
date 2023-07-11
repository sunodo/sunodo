import { ExtractAbiEvents } from "abitype";
import fs from "fs-extra";
import path from "path";
import { Command, Flags } from "@oclif/core";
import { createPublicClient, http, isAddress, Log } from "viem";
import { execa } from "execa";

import { createDriver } from "../node/driver/index.js";
import { DApp, DAppStore } from "../node/database/index.js";
import {
    controlledDAppFactoryAddress,
    cartesiIpfsdAppFactoryAddress,
    iFinancialProtocolABI,
    iMachineProtocolABI,
} from "../contracts.js";
import { DEFAULT_DEVNET_MNEMONIC } from "../wallet.js";

type FinancialRunwayLog = Log<
    bigint,
    number,
    ExtractAbiEvents<typeof iFinancialProtocolABI>,
    boolean,
    typeof iFinancialProtocolABI,
    "FinancialRunway"
>;
type MachineLocationLog = Log<
    bigint,
    number,
    ExtractAbiEvents<typeof iMachineProtocolABI>,
    boolean,
    typeof iMachineProtocolABI,
    "MachineLocation"
>;

export default class Controller extends Command {
    static summary = "Run a sunodo node controller.";

    static description =
        "A node controller manages the execution of nodes for DApps deployed through a blockchain.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static flags = {
        dev: Flags.boolean({
            description: "enable dev mode, running a local devnet",
            default: false,
        }),
        "block-time": Flags.integer({
            description: "interval between blocks (in seconds), for dev mode",
            default: 5,
        }),
        "epoch-duration": Flags.integer({
            description: "duration of an epoch (in seconds)",
            default: 86400,
        }),
        "rpc-url": Flags.string({
            description: "JSON-RPC url of ethereum node",
            default: "http://127.0.0.1:8545",
            char: "r",
        }),
        ipfs: Flags.url({
            description:
                "address of IPFS node to download the cartesi machine snapshot",
            default: new URL("http://127.0.0.1:5001"),
        }),
        "mnemonic-passphrase": Flags.string({
            description: "Use a BIP39 passphrase for the mnemonic.",
            helpGroup: "Wallet",
        }),
        "mnemonic-index": Flags.integer({
            description: "Use the private key from the given mnemonic index.",
            helpGroup: "Wallet",
            default: 0,
        }),
        "kms-key-id": Flags.string({
            description: "Use a private key stored in an AWS KMS key.",
            summary:
                "Need access to use the key through standard AWS client authentication mechanisms.",
            helpGroup: "Wallet",
        }),
        driver: Flags.string({
            description: "Node management driver to use",
            default: "docker",
            options: ["docker", "k8s", "fly"],
        }),
        financialProtocol: Flags.string({
            description:
                "Address of the contract to watch for application deployments",
        }),
        machineProtocol: Flags.string({
            description:
                "Address of the contract to watch for application machine locations",
        }),
        verbose: Flags.boolean({
            description: "verbose output",
            default: false,
            char: "v",
        }),
    };

    private async addMachine(db: DAppStore, log: MachineLocationLog) {
        const { args, blockNumber } = log;
        if (!blockNumber) {
            this.warn("Ignoring MachineLocation log from pending block");
            return;
        }
        if (!args.dapp) {
            this.warn("Ignoring undefined dapp address");
            return;
        }
        if (!args.location) {
            this.warn("Ignoring undefined location");
            return;
        }

        const { dapp, chainid, location } = args;
        const chainId = Number(chainid);
        // XXX: check chainId?
        db.addMachine(blockNumber, dapp, location);
    }

    private async addDApp(
        db: DAppStore,
        log: FinancialRunwayLog,
        now: bigint
    ): Promise<DApp | undefined> {
        const { args, blockNumber } = log;
        if (!blockNumber) {
            this.warn("Ignoring FinancialRunway log from pending block");
            return undefined;
        }
        if (!args.dapp) {
            this.warn("Ignoring undefined dapp address");
            return undefined;
        }
        if (!args.until) {
            this.warn("Ignoring undefined until");
            return undefined;
        }
        const { chainid, dapp: address, until } = args;
        const chainId = Number(chainid);
        // XXX: check chainId?

        // shutdownAt is the date when the dapp should be shutdown, milliseconds epoch as bigint
        const shutdownAt = until * 1000n;

        // update or create dapp in database
        return db.addDApp(blockNumber, now, { address, shutdownAt });
    }

    private async runDocker(
        blockInterval: number,
        devMode: boolean,
        verbose: boolean
    ): Promise<void> {
        // resolve compose file location based on version
        const composeFile = path.join(
            path.dirname(new URL(import.meta.url).pathname),
            "..",
            "node",
            "docker-compose-controller.yml"
        );

        // run docker infrastructure
        const args = [
            "compose",
            "--file",
            composeFile,
            "--project-directory",
            path.dirname(composeFile),
            "--project-name",
            "sunodo-controller",
        ];

        const attachment = verbose ? [] : ["--attach", "validator"];

        const env: NodeJS.ProcessEnv = {
            ANVIL_VERBOSITY: verbose ? "--steps-tracing" : "--silent",
            BLOCK_TIME: blockInterval.toString(),
            COMPOSE_PROFILES: devMode ? "dev" : "",
            REDIS_LOG_LEVEL: verbose ? "verbose" : "warning",
        };

        await execa("docker", [...args, "up", ...attachment], {
            env,
            stdio: "inherit",
        });
    }

    public async run(): Promise<void> {
        const { flags } = await this.parse(Controller);

        // run controller docker infrastructure
        await this.runDocker(flags["block-time"], flags.dev, flags.verbose);

        // connect to blockchain
        this.log(`connecting to ${flags["rpc-url"]}`);
        const client = createPublicClient({
            transport: http(flags["rpc-url"]),
        });
        const chainId = await client.getChainId();
        this.log(`connected to chain ${chainId}`);

        // directory to store cartesi machine snapshots
        const machineDir = path.join(this.config.dataDir, "machine");
        fs.ensureDirSync(machineDir);

        // driver for node management
        const driver = createDriver(flags.driver, machineDir, flags.ipfs);

        // connect to local database, lives inside dataDir
        // ~/.local/share/sunodo/31337/data.json
        const dbPath = path.resolve(
            path.join(this.config.dataDir, chainId.toString(), "data.json")
        );

        const db = fs.existsSync(dbPath)
            ? DAppStore.load(dbPath, BigInt(Date.now()))
            : new DAppStore(0n, {}, []);

        // see from which block we need to start to search for events
        const fromBlock = db.block;

        // query FinancialRunway events and update table
        const financialProtocol =
            flags.financialProtocol ||
            (chainId == 31337 && controlledDAppFactoryAddress[31337]);
        if (!financialProtocol) {
            throw new Error("No IFinancialProtocol contract address provided");
        }
        if (!isAddress(financialProtocol)) {
            throw new Error(`Invalid contract address: ${financialProtocol}`);
        }

        const machineProtocol =
            flags.machineProtocol ||
            (chainId == 31337 && cartesiIpfsdAppFactoryAddress[31337]);
        if (!machineProtocol) {
            throw new Error("No IMachineProtocol contract address provided");
        }
        if (!isAddress(machineProtocol)) {
            throw new Error(`Invalid contract address: ${machineProtocol}`);
        }

        // get logs I missed since last execution
        this.log(
            `Listening to contracts ${[
                financialProtocol,
                machineProtocol,
            ]} from block ${fromBlock}`
        );
        const financialFilter = await client.createContractEventFilter({
            abi: iFinancialProtocolABI,
            address: financialProtocol as `0x${string}`,
            eventName: "FinancialRunway",
            fromBlock,
        });
        const machineFilter = await client.createContractEventFilter({
            abi: iMachineProtocolABI,
            address: machineProtocol as `0x${string}`,
            eventName: "MachineLocation",
            fromBlock,
        });

        setInterval(async () => {
            // tick the clock, return dapps that should be shutdown at this time
            const now = BigInt(Date.now());
            const shutdown = db.tick(now);

            // stop nodes that should be stopped
            await Promise.all(
                shutdown.map(({ address }) => driver.stop(address))
            );

            // read any new machine location events
            const machineLogs = await client.getFilterChanges({
                filter: machineFilter,
            });
            for (const log of machineLogs) {
                await this.addMachine(db, log);
            }

            // read any new dapp financial runway events
            const financialLogs = await client.getFilterChanges({
                filter: financialFilter,
            });
            for (const log of financialLogs) {
                const start = await this.addDApp(db, log, now);
                if (start) {
                    // node should start immediatelly
                    const location = db.machines[start.address];
                    await driver.start(start.address, location);
                }
            }
        }, client.pollingInterval);
    }
}
