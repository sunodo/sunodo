import { unixfs } from "@helia/unixfs";
import { Command, Flags } from "@oclif/core";
import { carfs } from "@sunodo/car-download";
import { ExtractAbiEvents } from "abitype";
import { config } from "dotenv";
import { ensureDir, exists } from "fs-extra";
import { createHelia } from "helia";
import path from "node:path";
import { Log, getContract } from "viem";

import {
    iFinancialProtocolAbi,
    iMachineProtocolAbi,
    inputBoxAddress,
} from "../contracts.js";
import { Database } from "../driver/database.js";
import { Application, createDriver } from "../driver/index.js";
import { CommandLogger } from "../driver/logger.js";
import * as CustomFlags from "../flags.js";
import createClients, { supportedChains } from "../wallet.js";

type FinancialRunwayLog = Log<
    bigint,
    number,
    false,
    ExtractAbiEvents<typeof iFinancialProtocolAbi>,
    boolean,
    typeof iFinancialProtocolAbi,
    "FinancialRunway"
>;
type MachineLocationLog = Log<
    bigint,
    number,
    false,
    ExtractAbiEvents<typeof iMachineProtocolAbi>,
    boolean,
    typeof iMachineProtocolAbi,
    "MachineLocation"
>;

export default class Start extends Command {
    static description = "start a sunodo node";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    // feature/start: cli
    // feature/multi-dapp-node: spawn cartesi-node
    // feature/controller: blockchain scanning
    static flags = {
        "chain-id": Flags.integer({
            options: supportedChains({ includeDevnet: true }).map((c) =>
                c.id.toString(),
            ),
            summary: "network to use",
        }),
        "database-db": Flags.string({
            env: "PGDATABASE",
            exclusive: ["database-url"],
            helpGroup: "Database",
            summary: "postgres database name",
        }),
        "database-host": Flags.string({
            env: "PGHOST",
            exclusive: ["database-url"],
            helpGroup: "Database",
            summary: "postgres database host",
        }),
        "database-password": Flags.string({
            env: "PGPASSWORD",
            exclusive: ["database-url"],
            helpGroup: "Database",
            summary: "postgres database password",
        }),
        "database-port": Flags.integer({
            env: "PGPORT",
            exclusive: ["database-url"],
            helpGroup: "Database",
            summary: "postgres database port",
        }),
        "database-url": Flags.string({
            env: "PGURL",
            helpGroup: "Database",
            summary: "postgres database url",
        }),
        "database-user": Flags.string({
            env: "PGUSER",
            exclusive: ["database-url"],
            helpGroup: "Database",
            summary: "postgres database user",
        }),
        "epoch-duration": Flags.integer({
            default: 86_400,
            description: "duration of an epoch (in seconds)",
        }),
        "machine-directory": Flags.string({
            description: "directory to store cartesi machine snapshots",
        }),
        "mnemonic-index": Flags.integer({
            default: 0,
            description: "Use the private key from the given mnemonic index.",
            helpGroup: "Wallet",
        }),
        "mnemonic-passphrase": Flags.string({
            description: "Use a BIP39 passphrase for the mnemonic.",
            helpGroup: "Wallet",
        }),
        "private-key": CustomFlags.hex({
            description: "Use the given private key.",
            exclusive: ["mnemonic-passphrase"],
            helpGroup: "Wallet",
        }),
        provider: CustomFlags.address({
            description:
                "Address of the ValidatorNodeProvider contract to watch for application deployments",
            env: "SUNODO_PROVIDER",
            required: true,
            summary: "ValidatorNodeProvider contract address",
        }),
        "rpc-url": Flags.string({
            char: "r",
            description: "The RPC endpoint.",
            env: "ETH_RPC_URL",
            helpGroup: "Ethereum",
        }),
        verbose: Flags.boolean({
            char: "v",
            default: false,
            description: "verbose output",
        }),
        "ws-url": Flags.string({
            dependsOn: ["rpc-url"],
            description: "The Ethereum Websocket endpoint.",
            env: "ETH_WS_URL",
            helpGroup: "Ethereum",
        }),
    };

    public async run(): Promise<void> {
        const { flags } = await this.parse(Start);

        // load .env to inject into a configMap
        const env = {};
        config({ processEnv: env }); // XXX: load .sunodo.env instead?

        // connect to blockchain
        const { publicClient, walletClient } = await createClients({
            chain: supportedChains({ includeDevnet: true }).find(
                (c) => c.id === flags["chain-id"],
            ),
            mnemonicIndex: flags["mnemonic-index"],
            mnemonicPassphrase: flags["mnemonic-passphrase"],
            privateKey: flags["private-key"],
            rpcUrl: flags["rpc-url"],
        });

        const chainId = await publicClient.getChainId();
        this.log(`connected to chain ${chainId}`);

        const dataDir = path.join(this.config.dataDir, chainId.toString());
        await ensureDir(dataDir);

        // directory to store cartesi machine snapshots
        const machineDirectory =
            flags["machine-directory"] ||
            path.join(this.config.dataDir, "machines");
        await ensureDir(machineDirectory);

        // TODO: ask for these values
        const historyAddress = "0x4FF8BD9122b7D91d56Dd5c88FE6891Fb3c0b5281";
        const authorityAddress = "0x5050F233F2312B1636eb7CF6c7876D9cC6ac4785";

        const nodeEnv: NodeJS.ProcessEnv = {
            CARTESI_AUTH_MNEMONIC: flags["mnemonic-passphrase"], // XXX: add support for CARTESI_AUTH_PRIVATE_KEY
            CARTESI_BLOCKCHAIN_GENESIS_BLOCK: "1",
            CARTESI_BLOCKCHAIN_HTTP_ENDPOINT: flags["rpc-url"],
            CARTESI_BLOCKCHAIN_ID: publicClient.chain?.id.toString(),
            CARTESI_BLOCKCHAIN_IS_LEGACY: "false",
            CARTESI_BLOCKCHAIN_READ_DEPTH: "1",
            CARTESI_BLOCKCHAIN_WS_ENDPOINT: flags["ws-url"],
            CARTESI_CONTRACTS_AUTHORITY_ADDRESS: authorityAddress,
            CARTESI_CONTRACTS_HISTORY_ADDRESS: historyAddress,
            CARTESI_CONTRACTS_INPUT_BOX_ADDRESS: inputBoxAddress,
            CARTESI_EPOCH_DURATION: flags["epoch-duration"].toString(),
            CARTESI_FEATURE_HOST_MODE: "false",
            CARTESI_FEATURE_READER_MODE: "true",
            CARTESI_LOG_LEVEL: flags.verbose ? "debug" : "info",
            CARTESI_LOG_TIMESTAMP: "true",
            CARTESI_POSTGRES_ENDPOINT:
                "postgres://postgres:password@localhost:5432/postgres",
        };

        // create IPFS node
        const helia = await createHelia();
        const fs = unixfs(helia);
        const car = carfs(fs);
        this.log("IPFS node started");

        // driver for node management
        // only type for now is subprocess
        this.log(`machines will be stored at ${machineDirectory}`);
        const driver = createDriver(
            {
                carfs: car,
                env: nodeEnv,
                machineDirectory,
                type: "subprocess",
            },
            new CommandLogger(this, flags.verbose),
        );
        this.log("subprocess driver started");

        // connect to local database
        // default is inside dataDir: ~/.local/share/sunodo/31337/data.json
        const dbPath =
            flags.db ?? path.resolve(path.join(dataDir, "data.json"));

        this.log(`loading applications database from ${dbPath}`);
        const db = (await exists(dbPath))
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
        const { provider } = flags;
        if (!provider) {
            throw new Error(
                "No ValidatorNodeProvider contract address provided",
            );
        }

        // query IMachineProtocol and IFinancialRunway events
        const machineContract = getContract({
            abi: iMachineProtocolAbi,
            address: provider,
            client: {
                public: publicClient,
                wallet: walletClient,
            },
        });

        const financialContract = getContract({
            abi: iFinancialProtocolAbi,
            address: provider,
            client: {
                public: publicClient,
                wallet: walletClient,
            },
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
            // tick the clock, return applications that should be shutdown at this time
            const now = BigInt(Date.now());
            const shutdown = db.tick(now);

            // stop nodes that should be stopped
            await Promise.all(
                shutdown.map((application) => driver.stop(application)),
            );

            // read any new machine location events
            const machineLogs = await publicClient.getFilterChanges({
                filter: machineFilter,
            });

            await Promise.all(
                machineLogs.map((log) => this.addMachine(db, log)),
            );

            // read any new dapp financial runway events
            const financialLogs = await publicClient.getFilterChanges({
                filter: financialFilter,
            });

            await Promise.all(
                financialLogs.map(async (log) => {
                    const start = await this.addApplication(db, log, now);
                    if (start) {
                        // node should start immediatelly
                        const location = db.machines[start.address];
                        await driver.start(start, location);
                    }
                }),
            );
        }, publicClient.pollingInterval);
    }

    private async addApplication(
        db: Database,
        log: FinancialRunwayLog,
        now: bigint,
    ): Promise<Application | undefined> {
        const { args, blockHash, blockNumber, transactionHash } = log;
        if (!blockNumber) {
            this.warn("Ignoring FinancialRunway log from pending block");
            return undefined;
        }

        if (!args.application) {
            this.warn("Ignoring undefined dapp address");
            return undefined;
        }

        if (!args.until) {
            this.warn("Ignoring undefined until");
            return undefined;
        }

        const { application: address, until } = args;

        // shutdownAt is the date when the dapp should be shutdown, milliseconds epoch as bigint
        const shutdownAt = until * 1000n;

        // update or create dapp in database
        return db.addApplication(now, {
            address,
            blockHash,
            blockNumber,
            shutdownAt,
            transactionHash,
        });
    }

    private async addMachine(db: Database, log: MachineLocationLog) {
        const { args, blockNumber } = log;
        if (!blockNumber) {
            this.warn("Ignoring MachineLocation log from pending block");
            return;
        }

        if (!args.application) {
            this.warn("Ignoring undefined dapp address");
            return;
        }

        if (!args.location) {
            this.warn("Ignoring undefined location");
            return;
        }

        const { application, location } = args;
        db.addMachine(blockNumber, application, location);
    }
}
