import { input } from "@inquirer/prompts";
import { Address } from "abitype";
import chalk from "chalk";
import {
    Chain,
    createPublicClient as viemCreatePublicClient,
    createWalletClient as viemCreateWalletClient,
    formatUnits,
    http,
    HttpTransport,
    PublicClient,
    WalletClient,
    custom,
    Account,
    Transport,
} from "viem";
import { mnemonicToAccount, privateKeyToAccount } from "viem/accounts";
import { MetaMaskSDK } from "@metamask/sdk";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import qrcode from "qrcode-terminal";
import ansiColors from "ansi-colors";
import {
    arbitrum,
    arbitrumGoerli,
    foundry,
    mainnet,
    optimism,
    optimismGoerli,
    sepolia,
} from "@wagmi/chains";

import { Choice, hexInput, selectAuto } from "./prompts.js";

// list of all chains that will eventually be supported
export const chains: Chain[] = [
    arbitrum,
    arbitrumGoerli,
    mainnet,
    optimism,
    optimismGoerli,
    sepolia,
];

// list of chains that are currently enabled
const enabledChains: Chain[] = [arbitrumGoerli, optimismGoerli, sepolia];

// build a select choice from a Chain object
const chainChoices = chains.map((chain: Chain) => ({
    name: chain.name,
    value: chain,
    disabled:
        enabledChains.findIndex((c) => c.id === chain.id) == -1
            ? "(coming soon)"
            : false,
}));

export const DEFAULT_DEVNET_MNEMONIC =
    "test test test test test test test test test test test junk";

export type WalletType =
    | "metamask"
    | "walletconnect"
    | "mnemonic"
    | "private-key";
const walletChoices = (chain: Chain): Choice<WalletType>[] => {
    const dev = chain.id === foundry.id;
    return [
        {
            name: "MetaMask Mobile",
            value: "metamask",
            disabled: dev && "(not available)", // do not offer this wallets if chain is local foundry
        },
        {
            name: "WalletConnect",
            value: "walletconnect",
            disabled: dev && "(not available)", // do not offer this wallets if chain is local foundry
        },
        {
            name: `Mnemonic${dev ? "" : ansiColors.red(" (UNSAFE)")}`,
            value: "mnemonic",
        },
        {
            name: `Private Key${dev ? "" : ansiColors.red(" (UNSAFE)")}`,
            value: "private-key",
            disabled: dev && "(not available)", // do not offer this wallets if chain is local foundry
        },
    ];
};

export interface EthereumPromptOptions {
    dev?: boolean;
    chain?: Chain;
    rpcUrl?: string;
    mnemonicPassphrase?: string;
    mnemonicIndex?: number;
}

export type TransactionPrompt = (
    walletClient: WalletClient,
    publicClient: PublicClient,
) => Promise<Address>;

const selectChain = async (options: EthereumPromptOptions): Promise<Chain> => {
    if (options.chain) {
        const chain = options.chain;
        if (enabledChains.findIndex((c) => c.id === chain.id) >= 0) {
            return options.chain;
        }
        throw new Error(`Unsupported chain ${options.chain.network}`);
    } else if (options.dev) {
        // development mode, assume local foundry
        return foundry;
    } else {
        // allow user to select from list
        return await selectAuto<Chain>({
            message: "Chain",
            choices: chainChoices,
            pageSize: chainChoices.length,
            discardDisabled: true,
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
    } else {
        if (chain.rpcUrls.public.http) {
            // or chain.rpcUrls.default.http ?
            // if no url is provided, then the transport will fall back to a public RPC URL on the chain
            return http();
        } else {
            const url = await input({ message: "RPC URL" });
            return http(url);
        }
    }
};

const createPublicClient = async (
    chain: Chain,
    transport: HttpTransport,
): Promise<PublicClient> => {
    const publicClient = viemCreatePublicClient({ transport, chain });

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
 * @param account account to format the balance for
 * @param publicClient client to query the balance
 * @returns formatted balance string
 */
const addressBalanceLabel = async (
    address: Address,
    publicClient: PublicClient,
): Promise<string> => {
    const chain = publicClient.chain;
    if (chain) {
        // query balance using provider
        const balance = await publicClient.getBalance({ address });

        // format balance
        const symbol = chain.nativeCurrency.symbol;
        const balanceStr = formatUnits(balance, chain.nativeCurrency.decimals);
        let balanceLabel = chalk.bold(`${balanceStr} ${symbol}`);

        // display in red if balance is zero
        if (balance === 0n) {
            balanceLabel = chalk.red(balanceLabel);
        }
        return `${address} ${balanceLabel}`;
    } else {
        return address;
    }
};

const createWalletClient = async (
    options: EthereumPromptOptions,
    chain: Chain,
    publicClient: PublicClient,
    publicTransport: Transport,
): Promise<WalletClient> => {
    if (options.mnemonicPassphrase) {
        // mnemonic specified
        const account = mnemonicToAccount(options.mnemonicPassphrase, {
            addressIndex: options.mnemonicIndex,
        });

        // create wallet client
        return viemCreateWalletClient({
            account,
            transport: publicTransport,
            chain,
        });
    } else {
        const wallets = walletChoices(chain);
        const wallet = await selectAuto<WalletType>({
            message: "Wallet",
            choices: wallets,
            discardDisabled: true,
        });

        if (wallet === "metamask") {
            const metamask = new MetaMaskSDK({
                dappMetadata: { name: "Sunodo", url: "https://sunodo.io" },
                shouldShimWeb3: false,
            });

            // select account from wallet
            const client = viemCreateWalletClient({
                transport: custom(metamask.getProvider()),
                chain,
            });
            const addresses = await client.requestAddresses();
            const choices = await Promise.all(
                addresses.map(async (value) => {
                    const name = await addressBalanceLabel(value, publicClient);
                    return { name, value };
                }),
            );
            const account = await selectAuto<Address>({
                message: "Account",
                choices,
                pageSize: Math.min(addresses.length, 20),
            });

            // create wallet client
            return viemCreateWalletClient({
                account,
                transport: custom(metamask.getProvider()),
                chain,
            });
        } else if (wallet === "walletconnect") {
            const provider = await EthereumProvider.init({
                projectId: "a1b8592593d25d80129f09065e77ec38",
                showQrModal: false,
                chains: [chain.id],
            });
            provider.on("display_uri", (uri) =>
                qrcode.generate(uri, { small: true }),
            );
            await provider.connect();
            // select account from wallet
            const client = viemCreateWalletClient({
                transport: custom(provider),
                chain,
            });
            const addresses = await client.requestAddresses();
            const choices = await Promise.all(
                addresses.map(async (value) => {
                    const name = await addressBalanceLabel(value, publicClient);
                    return { name, value };
                }),
            );
            const account = await selectAuto<Address>({
                message: "Account",
                choices,
                pageSize: choices.length,
            });

            // create wallet client
            return viemCreateWalletClient({
                account,
                transport: custom(provider),
                chain,
            });
        } else if (wallet === "mnemonic") {
            // use the publicClient transport
            const mnemonic = await input({
                message: "Mnemonic",
                default:
                    chain.id === 31337 ? DEFAULT_DEVNET_MNEMONIC : undefined,
            });

            // select account from mnemonic
            if (options.mnemonicIndex) {
                return viemCreateWalletClient({
                    transport: publicTransport,
                    chain,
                    account: mnemonicToAccount(mnemonic, {
                        addressIndex: options.mnemonicIndex,
                    }),
                });
            } else {
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
                    message: "Account",
                    choices,
                    pageSize: choices.length,
                });

                return viemCreateWalletClient({
                    transport: publicTransport,
                    chain,
                    account,
                });
            }
        } else if (wallet === "private-key") {
            const privateKey = await hexInput({ message: "Private Key" });
            const account = privateKeyToAccount(privateKey);
            return viemCreateWalletClient({
                transport: publicTransport,
                chain,
                account,
            });
        }
        throw new Error(`Unsupported wallet ${wallet}`);
    }
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
