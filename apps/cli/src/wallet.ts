import { input } from "@inquirer/prompts";
import { Address } from "abitype";
import {
    Chain,
    createPublicClient as viemCreatePublicClient,
    createWalletClient as viemCreateWalletClient,
    http,
    HttpTransport,
    PublicClient,
    WalletClient,
    custom,
    Account,
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

const createWalletClient = async (
    options: EthereumPromptOptions,
    chain: Chain,
    publicTransport: HttpTransport,
): Promise<WalletClient> => {
    if (options.mnemonicPassphrase) {
        // mnemonic specified
        const account = mnemonicToAccount(options.mnemonicPassphrase, {
            accountIndex: options.mnemonicIndex,
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
            const account = await selectAuto<Address>({
                message: "Account",
                choices: addresses.map((address) => ({
                    name: address,
                    value: address,
                })),
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
            const account = await selectAuto<Address>({
                message: "Account",
                choices: addresses.map((address) => ({
                    name: address,
                    value: address,
                })),
                pageSize: Math.min(addresses.length, 20),
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
            const account = options.mnemonicIndex
                ? mnemonicToAccount(mnemonic, {
                      accountIndex: options.mnemonicIndex,
                  })
                : await selectAuto<Account>({
                      message: "Account",
                      choices: [...Array(10)].map((_, accountIndex) => {
                          const account = mnemonicToAccount(mnemonic, {
                              accountIndex,
                          });
                          return {
                              name: account.address,
                              value: account,
                          };
                      }),
                      pageSize: 10,
                  });

            return viemCreateWalletClient({
                transport: publicTransport,
                chain,
                account,
            });
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
    const walletClient = await createWalletClient(options, chain, transport);

    return {
        publicClient,
        walletClient,
    };
};

export default createClients;
