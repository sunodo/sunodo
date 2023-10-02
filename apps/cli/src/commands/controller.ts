import { ExtractAbiEvents } from "abitype";
import fs from "fs-extra";
import path from "path";
import { Command, Flags } from "@oclif/core";
import { createPublicClient, getContract, http, Log } from "viem";

import { createDriver } from "../node/driver/index.js";
import { Application, CommandLogger, Database } from "../node/index.js";
import { iFinancialProtocolABI, iMachineProtocolABI } from "../contracts.js";
import { configureProvider } from "../deploy.js";
import * as CustomFlags from "../flags.js";

type FinancialRunwayLog = Log<
    bigint,
    number,
    false,
    ExtractAbiEvents<typeof iFinancialProtocolABI>,
    boolean,
    typeof iFinancialProtocolABI,
    "FinancialRunway"
>;
type MachineLocationLog = Log<
    bigint,
    number,
    false,
    ExtractAbiEvents<typeof iMachineProtocolABI>,
    boolean,
    typeof iMachineProtocolABI,
    "MachineLocation"
>;

export default class Controller extends Command {
    static summary = "Run a sunodo node controller.";

    static description =
        "A node controller manages the execution of nodes for applications deployed to a blockchain.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static hidden = true;

    static flags = {
        "rpc-url": Flags.string({
            description: "JSON-RPC url of ethereum node",
            required: true,
            char: "r",
            env: "RPC_URL",
        }),
        driver: Flags.string({
            description: "Node management driver to use",
            required: true,
            default: "k8s",
            options: ["k8s"],
            env: "SUNODO_DRIVER",
        }),
        provider: CustomFlags.address({
            description:
                "Address of the ValidatorNodeProvider contract to watch for application deployments",
            env: "SUNODO_PROVIDER",
        }),
        verbose: Flags.boolean({
            description: "verbose output",
            default: false,
            char: "v",
        }),
        db: Flags.file({
            summary: "Path of applications database",
            description:
                "Path of the JSON file used to store information about the applications processed from the blockchain",
        }),
        "k8s-namespace": Flags.string({
            summary: "Kubernetes namespace to deploy applications to",
            description:
                "Application resources will be created in this given namespace",
            default: "default",
            env: "SUNODO_NAMESPACE",
        }),
    };

    private async addMachine(db: Database, log: MachineLocationLog) {
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

        const { dapp, location } = args;
        db.addMachine(blockNumber, dapp, location);
    }

    private async addApplication(
        db: Database,
        log: FinancialRunwayLog,
        now: bigint,
    ): Promise<Application | undefined> {
        const { args, blockNumber, blockHash, transactionHash } = log;
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
        const { dapp: address, until } = args;

        // shutdownAt is the date when the dapp should be shutdown, milliseconds epoch as bigint
        const shutdownAt = until * 1000n;

        // update or create dapp in database
        return db.addApplication(now, {
            address,
            blockHash,
            blockNumber,
            transactionHash,
            shutdownAt,
        });
    }

    public async run(): Promise<void> {
        const { flags } = await this.parse(Controller);

        // connect to blockchain
        this.log(`connecting to ${flags["rpc-url"]}`);
        const publicClient = createPublicClient({
            transport: http(flags["rpc-url"]),
        });
        const chainId = await publicClient.getChainId();
        this.log(`connected to chain ${chainId}`);

        // directory to store cartesi machine snapshots
        const dataDir = path.join(this.config.dataDir, chainId.toString());
        fs.ensureDirSync(dataDir);

        // driver for node management
        // XXX: only type for now is k8s
        const driver = createDriver(
            {
                type: "k8s",
                namespace: flags["k8s-namespace"],
            },
            new CommandLogger(this, flags.verbose),
        );

        // connect to local database
        // default is inside dataDir: ~/.local/share/sunodo/31337/data.json
        const dbPath =
            flags.db ?? path.resolve(path.join(dataDir, "data.json"));

        this.log(`loading applications database from ${dbPath}`);
        const db = fs.existsSync(dbPath)
            ? Database.load(dbPath, BigInt(Date.now()))
            : new Database(0n, {}, []);

        // store db on exit
        const exit = (_reason: string) => {
            this.log(`storing applications database at ${dbPath}`);
            db.store(dbPath);
            process.exit(0);
        };
        process
            .on("SIGTERM", () => exit("SIGTERM"))
            .on("SIGINT", () => exit("SIGINT"));

        // see from which block we need to start to search for events
        const fromBlock = db.block + 1n;

        // choose provider
        const provider = await configureProvider(publicClient, flags.provider);
        if (!provider) {
            throw new Error(
                "No ValidatorNodeProvider contract address provided",
            );
        }

        // query IMachineProtocol and IFinancialRunway events
        const machineContract = getContract({
            abi: iMachineProtocolABI,
            address: provider,
            publicClient,
        });
        const financialContract = getContract({
            abi: iFinancialProtocolABI,
            address: provider,
            publicClient,
        });

        // get logs I missed since last execution
        this.log(`listening to contract ${provider} from block ${fromBlock}`);
        const financialFilter =
            await financialContract.createEventFilter.FinancialRunway(
                {},
                { fromBlock, strict: true },
            );
        const machineFilter =
            await machineContract.createEventFilter.MachineLocation(
                {},
                { fromBlock, strict: true },
            );

        setInterval(async () => {
            // tick the clock, return dapps that should be shutdown at this time
            const now = BigInt(Date.now());
            const shutdown = db.tick(now);

            // stop nodes that should be stopped
            await Promise.all(shutdown.map((dapp) => driver.stop(dapp)));

            // read any new machine location events
            const machineLogs = await publicClient.getFilterChanges({
                filter: machineFilter,
            });
            for (const log of machineLogs) {
                await this.addMachine(db, log);
            }

            // read any new dapp financial runway events
            const financialLogs = await publicClient.getFilterChanges({
                filter: financialFilter,
            });
            for (const log of financialLogs) {
                const start = await this.addApplication(db, log, now);
                if (start) {
                    // node should start immediatelly
                    const location = db.machines[start.address];
                    await driver.start(start, location);
                }
            }
        }, publicClient.pollingInterval);
    }
}
