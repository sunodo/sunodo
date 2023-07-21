import { input, password as inputPassword, select } from "@inquirer/prompts";
import fs from "fs";
import path from "path";
import { Address, Hash, PublicClient, zeroAddress } from "viem";
import { ExtractAbiEvent } from "abitype";
import ora from "ora";
import { URL } from "url";
import chalk from "chalk";

import { importDirectory, testConnection } from "./ipfs.js";
import createClients, { EthereumPromptOptions } from "./wallet.js";
import { addressInput, selectAuto } from "./prompts.js";
import {
    authorityFactoryABI,
    authorityFactoryAddress,
    cartesiDAppFactoryABI,
    controlledDAppFactoryABI,
    controlledDAppFactoryAddress,
    iPayableDAppFactoryABI,
} from "./contracts.js";

type CartesiDAppFactoryABI = typeof cartesiDAppFactoryABI;
type ApplicationCreatedEvent = ExtractAbiEvent<
    CartesiDAppFactoryABI,
    "ApplicationCreated"
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

export type ConsensusOptions = {
    owner?: Address;
    authority?: Address;
    multisig?: Address;
    quorum?: Address;
    unpermissioned?: Address;
};

export type DeployOptions = {
    ipfs: IPFSOptions;
    network: EthereumPromptOptions;
    consensus: ConsensusOptions;
};

export type RewardsConfig =
    | { type: "offchain" }
    | { type: "erc20"; factoryAddress: Address; salary: bigint; funds: bigint };

/**
 * Fetches a list of authorities deployed by an AuthorityFactory contract
 * @param publicClient viem public client
 * @param address address of the AuthorityFactory contract
 * @param fromBlock start of scan, usually the deployment block of the AuthorityFactory contract
 * @returns list of addresses of deployed authorities
 */
const fetchAuthorities = async (
    publicClient: PublicClient,
    address: Address,
): Promise<Address[]> => {
    const chainId = publicClient.chain?.id;
    if (chainId) {
        const fromBlocks: Record<number, bigint> = {
            31337: 0n,
            // 11155111: 3982032n, // block number AuthorityFactory was deployed on this network
        };
        const fromBlock = fromBlocks[chainId];
        if (fromBlock) {
            // create filter to read events from an AuthorityFactory contract
            const filter = await publicClient.createContractEventFilter({
                abi: authorityFactoryABI,
                eventName: "AuthorityCreated",
                address,
                fromBlock,
            });

            // read all logs since beginning of time
            const logs = await publicClient.getFilterLogs({ filter });

            // parse logs into list of authorities
            const authorities = logs
                .filter((log) => log.args.authority)
                .map((log) => log.args.authority!);
            return authorities;
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
 *
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
    const { publicClient, walletClient } = await createClients(options);
    return {
        publicClient,
        walletClient,
    };
};

const configureOwner = async (
    options: ConsensusOptions,
    account?: Address,
): Promise<Address> => {
    const defaultOwner = account;
    const owner: Address =
        options.owner ||
        (await addressInput({
            message: "Application Owner",
            default: defaultOwner,
        }));
    return owner;
};

const configureConsensusAuthority = async (
    options: ConsensusOptions,
    publicClient: PublicClient,
): Promise<Address> => {
    // honor the authority address if specified
    if (options.authority) {
        // TODO: validate if consensus is really a consensus contract
        return options.authority;
    }

    // get list of authorities created from factory
    const authorities = await fetchAuthorities(
        publicClient,
        authorityFactoryAddress,
    );

    if (authorities.length > 1) {
        // show a list of authorities to select from, with an "other" option
        const choices: { name: string; value: Address }[] = authorities.map(
            (authority) => ({
                name: authority,
                value: authority,
            }),
        );
        choices.push({ name: "Other", value: zeroAddress });
        let authority = await select<Address>({
            message: "Authority Address",
            choices: choices,
        });
        if (authority == zeroAddress) {
            // user selected "other", ask for address
            authority = await addressInput({
                message: "Authority Address",
                default: authorities.length > 0 ? authorities[0] : undefined,
            });
        }
        return authority;
    } else {
        // ask for authority address, with the default being the one on the list (if any)
        return addressInput({
            message: "Authority Address",
            default: authorities.length > 0 ? authorities[0] : undefined,
        });
    }

    // TODO: validate if consensus is really a consensus contract
};

const configureConsensus = async (
    options: ConsensusOptions,
    publicClient: PublicClient,
): Promise<Address> => {
    let consensusType;
    if (options.authority) {
        consensusType = "authority";
    } else if (options.multisig) {
        consensusType = "multisig";
    } else if (options.quorum) {
        consensusType = "quorum";
    } else if (options.unpermissioned) {
        consensusType = "unpermissioned";
    }
    if (!consensusType) {
        consensusType = await selectAuto<ConsensusType>({
            message: "Consensus Type",
            choices: [
                {
                    value: "authority",
                    name: "Authority",
                    description:
                        "An Authority has the power to submit any claims of the state of the machine, and cannot be challenged",
                },
                {
                    value: "multisig",
                    name: "Multisig",
                    description:
                        "The multisig is still an Authority validator, where a set of validators who are part of a Safe multisig must agree on the state of the machine. If there is no agreement the application will be no longer validated, there is still no consensus protocol.",
                    disabled: "(coming soon)",
                },
                {
                    value: "quorum",
                    name: "Quorum",
                    description:
                        "The application is validated by a quorum of validators, who must agree on the state of the machine. If there is any disagreement a challenge is initiated and the verification protocol is initiated.",
                    disabled: "(coming soon)",
                },
                {
                    value: "unpermissioned",
                    name: "Unpermissioned",
                    description:
                        "The application can be validated by any party in an unpermissioned way. If there is any disagreement a challenge is initiated and the verification protocol is initiated.",
                    disabled: "(coming soon)",
                },
            ],
            discardDisabled: false,
        });
    }

    if (consensusType == "authority") {
        return configureConsensusAuthority(options, publicClient);
    }

    throw new Error(`Unsupported consensus type ${consensusType}`);
};

const configureRewards = async (): Promise<RewardsConfig> => {
    const type = await selectAuto<"offchain" | "erc20">({
        message: "Rewards mechanism for validator",
        choices: [
            {
                name: "No on-chain rewards",
                description:
                    "Validators control node execution and are paid off-chain",
                value: "offchain",
            },
            {
                name: "ERC-20 rewards",
                description: "Validators are paid in ERC-20 tokens",
                value: "erc20",
                disabled: "(coming soon)",
            },
        ],
        discardDisabled: false,
    });
    if (type === "offchain") {
        return { type };
    } else {
        // TODO: implement erc-20 based rewards
        // TODO: ask for ERC20DAppFactory (created by ERC20DAppSystem)
        throw new Error(`Unsupported rewards type ${type}`);
    }
};

const deploy = async (
    machine: string,
    options: DeployOptions,
): Promise<Address> => {
    // check machine integrity and return its hash
    const templateHash = await check(machine);
    process.stdout.write(
        `${chalk.green("?")} Machine hash ${chalk.cyan(templateHash)}\n`,
    );

    // 4 steps: machine, network, consensus, reward

    // publish machine
    const { method, location } = await publish(machine, options);
    process.stdout.write(
        `${chalk.green("?")} Machine ${method} location ${chalk.cyan(
            location,
        )}\n`,
    );

    // configure network
    const { publicClient, walletClient } = await configureNetwork(
        options.network,
    );

    // configure owner and consensus
    const owner = await configureOwner(
        options.consensus,
        walletClient.account?.address,
    );
    const consensus = await configureConsensus(options.consensus, publicClient);

    // configure rewards mechanism
    const rewards = await configureRewards();

    // send transaction
    let hash;
    if (rewards.type === "offchain") {
        const { request } = await publicClient.simulateContract({
            abi: controlledDAppFactoryABI,
            address: controlledDAppFactoryAddress,
            functionName: "newApplication",
            args: [consensus, owner, templateHash, location],
        });
        hash = await walletClient.writeContract(request);
    } else if (rewards.type === "erc20") {
        const { request } = await publicClient.simulateContract({
            abi: iPayableDAppFactoryABI,
            address: rewards.factoryAddress,
            functionName: "newApplication",
            args: [
                consensus,
                owner,
                templateHash,
                location,
                rewards.salary,
                rewards.funds,
            ],
        });
        hash = await walletClient.writeContract(request);
    }

    if (hash) {
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
        for (const log of logs) {
            const { application } = log.args;
            if (application) {
                return application;
            }
        }
        throw new Error("ApplicationCreated event not found");
    } else {
        throw new Error("Transaction hash not found");
    }
};

export default deploy;
