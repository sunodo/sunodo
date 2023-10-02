import { input, password as inputPassword, select } from "@inquirer/prompts";
import fs from "fs";
import path from "path";
import {
    Address,
    formatUnits,
    getAddress,
    getContract,
    GetContractReturnType,
    Hash,
    isAddress,
    parseUnits,
    PublicClient,
    WalletClient,
    zeroAddress,
} from "viem";
import { ExtractAbiEvent } from "abitype";
import ora from "ora";
import { URL } from "url";
import chalk from "chalk";
import { cacheExchange, createClient, fetchExchange } from "@urql/core";

import { importDirectory, testConnection } from "./ipfs.js";
import createClients, { EthereumPromptOptions } from "./wallet.js";
import { addressInput, bigintInput, selectAuto } from "./prompts.js";
import {
    cartesiDAppFactoryABI,
    erc20ABI,
    iValidatorNodeProviderABI,
    marketplaceABI,
    marketplaceAddress,
} from "./contracts.js";
import { Deployment } from "./commands/deploy/index.js";
import { ValidatorNodeProvidersDocument } from "./graphql/index.js";

type CartesiDAppFactoryABI = typeof cartesiDAppFactoryABI;
type ApplicationCreatedEvent = ExtractAbiEvent<
    CartesiDAppFactoryABI,
    "ApplicationCreated"
>;
type IValidatorNodeProvider = GetContractReturnType<
    typeof iValidatorNodeProviderABI,
    PublicClient,
    WalletClient,
    Address
>;
type ERC20 = GetContractReturnType<
    typeof erc20ABI,
    PublicClient,
    WalletClient,
    Address
>;

export type MachinePublishing = "ipfs" | "http" | "local";
export type PublishResult = {
    method: MachinePublishing;
    location: string;
};

export type ConsensusType =
    | "authority"
    | "multisig"
    | "quorum"
    | "unpermissioned";

export type IPFSOptions = {
    url?: URL;
    username?: string;
    password?: string;
};

export type DeployOptions = {
    ipfs: IPFSOptions;
    network: EthereumPromptOptions;
    owner?: Address;
    provider?: Address;
};

export type RewardsConfig = { token: ERC20; runway: bigint; cost: bigint };

/**
 * Fetches a list of factories created from the payment system
 * @param publicClient viem public client
 * @returns list of addresses of deployed factories
 */
const fetchProviders = async (
    publicClient: PublicClient,
): Promise<Address[]> => {
    const chainId = publicClient.chain?.id;
    if (chainId) {
        const indexingUrl: Record<number, string> = {
            11155111: "https://squid.subsquid.io/sunodo-sepolia/graphql",
        };

        const url = indexingUrl[chainId];
        if (url) {
            const client = createClient({
                url,
                exchanges: [cacheExchange, fetchExchange],
            });
            const { data } = await client
                .query(ValidatorNodeProvidersDocument, {})
                .toPromise();
            if (data?.validatorNodeProviders) {
                return data.validatorNodeProviders
                    .filter((provider) => isAddress(provider.id))
                    .map((provider) => getAddress(provider.id));
            }
        } else {
            const fromBlocks: Record<number, bigint> = {
                31337: 0n,
                // 11155111: 4058614n, // block number Marketplace was deployed on this network
            };
            const fromBlock = fromBlocks[chainId];
            if (fromBlock !== undefined) {
                // create filter to read events from the Marketplace contract
                const filter = await publicClient.createContractEventFilter({
                    abi: marketplaceABI,
                    eventName: "ValidatorNodeProviderCreated",
                    address: marketplaceAddress,
                    fromBlock,
                });

                // read all logs since beginning of time
                const logs = await publicClient.getFilterLogs({ filter });

                // parse logs into list of factories
                const providers = logs
                    .filter((log) => log.args.provider)
                    .map((log) => log.args.provider!);
                return providers;
            }
        }
    }
    return [];
};

/**
 * Check the integrity of the cartesi machine and returns its hash
 * @param machine directory of cartesi machine snapshot to deploy
 * @returns hash of the machine
 */
const check = async (machine: string): Promise<Hash> => {
    if (!fs.existsSync(machine) || !fs.statSync(machine).isDirectory()) {
        throw new Error(
            "Cartesi machine snapshot not found, run 'sunodo build'",
        );
    }

    const templateHash = fs
        .readFileSync(path.join(machine, "hash"))
        .toString("hex");
    return `0x${templateHash}`;
};

const publishIPFS = async (
    machine: string,
    options: IPFSOptions,
): Promise<PublishResult> => {
    // XXX: start own IPFS node?

    if (!options.url) {
        // test if there is a local IPFS node running locally
        const localhost = "http://127.0.0.1:5001";
        const localhostRunning =
            (await testConnection({ url: new URL(localhost) })) === "success";

        // ask for IPFS node URL, default is local node if there is one running
        const url = await input({
            message: "IPFS node URL",
            default: localhostRunning ? localhost : undefined,
        });
        options.url = new URL(url);
    }

    // try to connect with specified options
    let status = await testConnection(options);

    if (status === "unauthorized" && (!options.username || !options.password)) {
        // if received unauthorized, ask for username and password
        options.username =
            options.username || (await input({ message: "IPFS username" }));
        options.password =
            options.password ||
            (await inputPassword({ message: "IPFS password" }));

        // try again, with username/password
        status = await testConnection(options);
    }

    if (status !== "success") {
        throw new Error(`Error connecting to IPFS ${options.url}`);
    }

    const cid = await importDirectory(machine, options);
    return { method: "ipfs", location: cid };
};

/**
 * Publish the cartesi machine to a public location
 * @param machine directory of cartesi machine snapshot to deploy
 * @param options
 * @returns selected publishing method and location of published machine
 */
const publish = async (
    machine: string,
    options: DeployOptions,
): Promise<PublishResult> => {
    // assume the method is "ipfs" if user specified an IPFS url, otherwise ask
    const method = options.ipfs.url
        ? "ipfs"
        : await selectAuto<MachinePublishing>({
              message: "Machine publishing method",
              choices: [
                  {
                      name: "IPFS",
                      value: "ipfs",
                      description:
                          "Machine will be published to an IPFS node, which can be running locally or remotely, and seeding the machine until it's pinned by a validator",
                  },
                  {
                      name: "HTTP",
                      value: "http",
                      description:
                          "Machine must have been previouly published to a publicly accessible HTTP server",
                      disabled: "(coming soon)",
                  },
                  {
                      name: "Local file",
                      value: "local",
                      description:
                          "Machine must be accessible locally on the machine the validator node is running",
                      disabled: "(coming soon)",
                  },
              ],
              discardDisabled: false,
          });

    if (method === "ipfs") {
        return publishIPFS(machine, options.ipfs);
    } else if (method === "http") {
        const location = await input({
            message: "Location of published machine tarball",
        });
        return { method, location };
    } else if (method === "local") {
        return { method, location: machine };
    }
    throw new Error("Unsupported machine publishing method");
};

const configureNetwork = async (options: EthereumPromptOptions) => {
    const { chain, publicClient, walletClient } = await createClients(options);
    return {
        chain,
        publicClient,
        walletClient,
    };
};

const configureOwner = async (
    givenOwner?: Address,
    account?: Address,
): Promise<Address> => {
    const defaultOwner = account;
    const owner: Address =
        givenOwner ||
        (await addressInput({
            message: "Application Owner",
            default: defaultOwner,
        }));
    return owner;
};

export const configureProvider = async (
    publicClient: PublicClient,
    provider?: Address,
): Promise<Address> => {
    // honor the provider address if specified
    if (provider) {
        return provider;
    }

    // get list of factories created from marketplace
    const providers = await fetchProviders(publicClient);

    if (providers.length > 1) {
        // show a list of providers to select from, with an "other" option
        const choices: { name: string; value: Address }[] = providers.map(
            (provider) => ({
                name: provider,
                value: provider,
            }),
        );
        choices.push({ name: "Other", value: zeroAddress });
        let provider = await select<Address>({
            message: "ValidatorNodeProvider Address",
            choices: choices,
        });
        if (provider == zeroAddress) {
            // user selected "other", ask for address
            provider = await addressInput({
                message: "ValidatorNodeProvider Address",
                default: providers.length > 0 ? providers[0] : undefined,
            });
        }
        return provider;
    } else {
        // ask for authority address, with the default being the one on the list (if any)
        const provider = await addressInput({
            message: "ValidatorNodeProvider Address",
            default: providers.length > 0 ? providers[0] : undefined,
        });
        return provider;
    }
};

const configureRewards = async (
    publicClient: PublicClient,
    walletClient: WalletClient,
    provider: IValidatorNodeProvider,
): Promise<RewardsConfig> => {
    // query the provider's token
    const token = getContract({
        abi: erc20ABI,
        address: await provider.read.token(),
        publicClient,
        walletClient,
    });

    // ask for how many days to prepay
    const days = await bigintInput({
        message: "Pre-payment period (days)",
        decimals: 0,
        default: 7n,
    });
    const runway = days * 24n * 60n * 60n; // number of seconds

    // calculate cost of number of days
    const p = ora("Calculating cost...").start();
    const cost = await provider.read.cost([runway]);
    const costStr = `${formatUnits(
        cost,
        await token.read.decimals(),
    )} ${await token.read.symbol()}`;
    p.succeed(
        `Cost for ${days} day${days > 1 ? "s" : ""} ${chalk.cyan(costStr)}`,
    );

    return {
        token,
        runway,
        cost,
    };
};

const deploy = async (
    machine: string,
    options: DeployOptions,
): Promise<Deployment> => {
    // check machine integrity and return its hash
    const templateHash = await check(machine);
    process.stdout.write(
        `${chalk.green("?")} Machine hash ${chalk.cyan(templateHash)}\n`,
    );

    // 4 steps: machine, network, provider, payment

    // publish machine
    const { method, location } = await publish(machine, options);
    process.stdout.write(
        `${chalk.green("?")} Machine ${method} location ${chalk.cyan(
            location,
        )}\n`,
    );

    // configure network
    const { chain, publicClient, walletClient } = await configureNetwork(
        options.network,
    );

    // configure owner
    const owner = await configureOwner(
        options.owner,
        walletClient.account?.address,
    );

    // choose provider
    const providerAddress = await configureProvider(
        publicClient,
        options.provider,
    );
    const provider = getContract({
        abi: iValidatorNodeProviderABI,
        address: providerAddress,
        publicClient,
        walletClient,
    });

    // now fund the application
    const { token, runway, cost } = await configureRewards(
        publicClient,
        walletClient,
        provider,
    );

    if (cost > 0n) {
        // check allowance, send allowance transaction if needed
        const allowance = await token.read.allowance([
            walletClient.account!.address,
            provider.address,
        ]);

        // check if need to add allowance
        if (allowance < cost) {
            const newAllowance = await bigintInput({
                message: "Allowance",
                decimals: await token.read.decimals(),
                default: cost,
                validate: async (value) => {
                    const amount = parseUnits(
                        value,
                        await token.read.decimals(),
                    );
                    if (amount < cost) {
                        return "Insufficient allowance";
                    }
                    return true;
                },
            });
            const { request } = await token.simulate.approve(
                [provider.address, newAllowance],
                { account: walletClient.account },
            );
            const hash = await walletClient.writeContract(request);
            const progress = ora(`Submitting transaction ${hash}...`).start();
            const receipt = await publicClient.waitForTransactionReceipt({
                hash,
            });
            progress.succeed(`Transaction mined ${chalk.cyan(hash)}`);
        }
    }

    // send deploy transaction
    const { request } = await provider.simulate.deploy(
        [owner, templateHash, location, runway],
        { account: walletClient.account },
    );
    const hash = await walletClient.writeContract(request);
    const progress = ora(`Submitting transaction ${hash}...`).start();
    const receipt = await publicClient.waitForTransactionReceipt({
        hash,
    });
    progress.succeed(`Transaction mined ${chalk.cyan(hash)}`);
    // XXX: read log directly from receipt
    const logs = await publicClient.getLogs<ApplicationCreatedEvent>({
        blockHash: receipt.blockHash,
        event: cartesiDAppFactoryABI[0],
    });
    const application = logs[0].args.application;
    if (!application) {
        throw new Error("ApplicationCreated event not found");
    }

    return {
        address: application,
        chainId: chain.id,
        transaction: hash,
        provider: provider.address,
        owner,
        templateHash,
        location,
    };
};

export default deploy;
