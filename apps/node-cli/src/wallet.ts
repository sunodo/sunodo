import { input } from "@inquirer/prompts";
import { MetaMaskSDK } from "@metamask/sdk";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import chalk from "chalk";
import * as qrcode from "qrcode-terminal";
import {
    Account,
    Address,
    Chain,
    Hex,
    HttpTransport,
    PublicClient,
    Transport,
    WalletClient,
    custom,
    formatUnits,
    http,
    createPublicClient as viemCreatePublicClient,
    createWalletClient as viemCreateWalletClient,
} from "viem";
import { mnemonicToAccount, privateKeyToAccount } from "viem/accounts";
import {
    arbitrum,
    arbitrumGoerli,
    foundry,
    mainnet,
    optimism,
    optimismGoerli,
    sepolia,
} from "viem/chains";

import { Choice, hexInput, selectAuto } from "./prompts.js";

// list of all supported chains
export type SupportedChainsOptions = {
    includeDevnet?: boolean;
    includeMainnets?: boolean;
    includeTestnets?: boolean;
};

export const supportedChains = (options?: SupportedChainsOptions): Chain[] => {
    options = options || {
        includeDevnet: false, // default is not to show devnet
        includeMainnets: true,
        includeTestnets: true,
    };
    options.includeTestnets = options.includeTestnets ?? true; // default is true if not specified
    options.includeMainnets = options.includeMainnets ?? true; // default is true if not specified

    const chains: Chain[] = [];
    if (options.includeDevnet) {
        chains.push(foundry);
    }

    if (options.includeTestnets) {
        chains.push(arbitrumGoerli, optimismGoerli, sepolia);
    }

    if (options.includeMainnets) {
        chains.push(arbitrum, mainnet, optimism);
    }

    return chains;
};

export const DEFAULT_DEVNET_MNEMONIC =
    "test test test test test test test test test test test junk";

export type WalletType =
    | "metamask"
    | "mnemonic"
    | "private-key"
    | "walletconnect";
const walletChoices = (chain: Chain): Choice<WalletType>[] => {
    const dev = chain.id === foundry.id;
    return [
        {
            disabled: dev && "(not available)", // do not offer this wallets if chain is local foundry
            name: "MetaMask Mobile",
            value: "metamask",
        },
        {
            disabled: dev && "(not available)", // do not offer this wallets if chain is local foundry
            name: "WalletConnect",
            value: "walletconnect",
        },
        {
            name: `Mnemonic${dev ? "" : chalk.red(" (UNSAFE)")}`,
            value: "mnemonic",
        },
        {
            name: `Private Key${dev ? "" : chalk.red(" (UNSAFE)")}`,
            value: "private-key",
        },
    ];
};

export interface EthereumPromptOptions {
    chain?: Chain;
    mnemonicIndex?: number;
    mnemonicPassphrase?: string;
    privateKey?: Hex;
    rpcUrl?: string;
}

export type TransactionPrompt = (
    walletClient: WalletClient,
    publicClient: PublicClient,
) => Promise<Address>;

const selectChain = async (options: EthereumPromptOptions): Promise<Chain> => {
    // if development mode, include foundry as an option
    const chains = supportedChains({ includeDevnet: true });

    if (options.chain) {
        const { chain } = options;
        if (chains.findIndex((c) => c.id === chain.id) >= 0) {
            return chain;
        }

        throw new Error(`Unsupported chainId ${chain.id}`);
    } else {
        // allow user to select from list
        const choices = chains.map((chain) => ({
            name: chain.name,
            value: chain,
        }));

        return selectAuto<Chain>({
            choices,
            discardDisabled: true,
            message: "Chain",
            pageSize: choices.length,
        });
    }
};

const selectTransport = async (
    options: EthereumPromptOptions,
    chain: Chain,
): Promise<HttpTransport> => {
    // use user provided url (in args) or try to use default one from chain, or ask for one
    if (options.rpcUrl) {
        return http(options.rpcUrl);
    }

    const url = await input({
        default: chain.rpcUrls.default.http[0],
        message: "RPC URL",
    });

    return http(url);
};

const createPublicClient = async (
    chain: Chain,
    transport: HttpTransport,
): Promise<PublicClient> => {
    const publicClient = viemCreatePublicClient({ chain, transport });

    // check if chainId matches
    const chainId = await publicClient.getChainId();
    if (chainId !== chain.id) {
        throw new Error(
            `Chain of provided RPC URL (${chainId}) does not match selected chain (${chain.id}))`,
        );
    }

    return publicClient;
};

/**
 * Format the balance of an account for display
 * @param address account to format the balance for
 * @param publicClient client to query the balance
 * @returns formatted balance string
 */
const addressBalanceLabel = async (
    address: Address,
    publicClient: PublicClient,
): Promise<string> => {
    const { chain } = publicClient;
    if (chain) {
        // query balance using provider
        const balance = await publicClient.getBalance({ address });

        // format balance
        const { decimals, symbol } = chain.nativeCurrency;
        const balanceStr = formatUnits(balance, decimals);
        let balanceLabel = chalk.bold(`${balanceStr} ${symbol}`);

        // display in red if balance is zero
        if (balance === 0n) {
            balanceLabel = chalk.red(balanceLabel);
        }

        return `${address} ${balanceLabel}`;
    }

    return address;
};

const createWalletClient = async (
    options: EthereumPromptOptions,
    chain: Chain,
    publicClient: PublicClient,
    publicTransport: Transport,
): Promise<WalletClient> => {
    if (options.privateKey) {
        // private key specified
        const account = privateKeyToAccount(options.privateKey);
        return viemCreateWalletClient({
            account,
            chain,
            transport: publicTransport,
        });
    }

    if (options.mnemonicPassphrase) {
        // mnemonic specified
        const account = mnemonicToAccount(options.mnemonicPassphrase, {
            addressIndex: options.mnemonicIndex,
        });

        // create wallet client
        return viemCreateWalletClient({
            account,
            chain,
            transport: publicTransport,
        });
    }

    const wallets = walletChoices(chain);
    const wallet = await selectAuto<WalletType>({
        choices: wallets,
        discardDisabled: true,
        message: "Wallet",
    });

    switch (wallet) {
        case "metamask": {
            const metamask = new MetaMaskSDK({
                dappMetadata: { name: "Sunodo", url: "https://sunodo.io" },
                shouldShimWeb3: false,
            });

            // select account from wallet
            const client = viemCreateWalletClient({
                chain,
                transport: custom(metamask.getProvider()),
            });
            const addresses = await client.requestAddresses();
            const choices = await Promise.all(
                addresses.map(async (value) => {
                    const name = await addressBalanceLabel(value, publicClient);
                    return { name, value };
                }),
            );
            const account = await selectAuto<Address>({
                choices,
                message: "Account",
                pageSize: Math.min(addresses.length, 20),
            });

            // create wallet client
            return viemCreateWalletClient({
                account,
                chain,
                transport: custom(metamask.getProvider()),
            });
        }

        case "walletconnect": {
            const provider = await EthereumProvider.init({
                chains: [chain.id],
                projectId: "a1b8592593d25d80129f09065e77ec38",
                showQrModal: false,
            });
            provider.on("display_uri", (uri) =>
                qrcode.generate(uri, { small: true }),
            );
            await provider.connect();
            // select account from wallet
            const client = viemCreateWalletClient({
                chain,
                transport: custom(provider),
            });
            const addresses = await client.requestAddresses();
            const choices = await Promise.all(
                addresses.map(async (value) => {
                    const name = await addressBalanceLabel(value, publicClient);
                    return { name, value };
                }),
            );
            const account = await selectAuto<Address>({
                choices,
                message: "Account",
                pageSize: choices.length,
            });

            // create wallet client
            return viemCreateWalletClient({
                account,
                chain,
                transport: custom(provider),
            });
        }

        case "mnemonic": {
            // use the publicClient transport
            const mnemonic = await input({
                default:
                    chain.id === 31_337 ? DEFAULT_DEVNET_MNEMONIC : undefined,
                message: "Mnemonic",
            });

            // select account from mnemonic
            if (options.mnemonicIndex) {
                return viemCreateWalletClient({
                    account: mnemonicToAccount(mnemonic, {
                        addressIndex: options.mnemonicIndex,
                    }),
                    chain,
                    transport: publicTransport,
                });
            }

            const choices = await Promise.all(
                [...Array(10)].map(async (_, addressIndex) => {
                    const account = mnemonicToAccount(mnemonic, {
                        addressIndex,
                    });
                    const name = await addressBalanceLabel(
                        account.address,
                        publicClient,
                    );
                    return { name, value: account };
                }),
            );

            const account = await selectAuto<Account>({
                choices,
                message: "Account",
                pageSize: choices.length,
            });

            return viemCreateWalletClient({
                account,
                chain,
                transport: publicTransport,
            });
        }

        case "private-key": {
            const privateKey = await hexInput({ message: "Private Key" });
            const account = privateKeyToAccount(privateKey);
            return viemCreateWalletClient({
                account,
                chain,
                transport: publicTransport,
            });
        }
    }

    throw new Error(`Unsupported wallet ${wallet}`);
};

const createClients = async (
    options: EthereumPromptOptions,
): Promise<{
    chain: Chain;
    publicClient: PublicClient;
    walletClient: WalletClient;
}> => {
    // select chain
    const chain = await selectChain(options);

    // select RPC URL
    const transport = await selectTransport(options, chain);

    // create public client
    const publicClient = await createPublicClient(chain, transport);

    // create wallet client
    const walletClient = await createWalletClient(
        options,
        chain,
        publicClient,
        transport,
    );

    return {
        chain,
        publicClient,
        walletClient,
    };
};

export default createClients;
