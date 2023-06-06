import { input, select } from "@inquirer/prompts";
import { Address } from "abitype";
import {
    Chain,
    createPublicClient as viemCreatePublicClient,
    createWalletClient as viemCreateWalletClient,
    http,
    HttpTransport,
    PublicClient,
    WalletClient,
} from "viem";
import { mnemonicToAccount } from "viem/accounts";

const DEFAULT_DEVNET_MNEMONIC =
    "test test test test test test test test test test test junk";

export interface EthereumPromptOptions {
    supportedChains: Chain[];
    chain?: string;
    rpcUrl?: string;
    mnemonicPassphrase?: string;
    mnemonicIndex?: number;
}

export type TransactionPrompt = (
    walletClient: WalletClient,
    publicClient: PublicClient
) => Promise<Address>;

const selectChain = async (options: EthereumPromptOptions): Promise<Chain> => {
    if (options.chain) {
        // user selected chain
        const userSelectedChain = options.chain;

        // lookup by name or id, support both
        const chain = options.supportedChains.find(
            (chain) =>
                chain.name === userSelectedChain ||
                chain.id === parseInt(userSelectedChain)
        );
        if (!chain) {
            throw new Error(`Chain ${userSelectedChain} not supported`);
        }
        return chain;
    } else if (options.supportedChains.length === 1) {
        // there is only one chain supported, return it
        return options.supportedChains[0];
    } else {
        // allow user to select from list
        return await select<Chain>({
            message: "Select Chain",
            choices: options.supportedChains.map((chain) => ({
                name: chain.name,
                value: chain,
            })),
        });
    }
};

const selectTransport = async (
    options: EthereumPromptOptions,
    chain: Chain
): Promise<HttpTransport> => {
    // use user provided url (in args) or try to use default one from chain, or ask for one
    let url: string =
        options.rpcUrl ||
        (chain.rpcUrls.default.http
            ? chain.rpcUrls.default.http[0]
            : await input({ message: "RPC URL" }));

    return http(url);
};

const createPublicClient = async (
    chain: Chain,
    transport: HttpTransport
): Promise<PublicClient> => {
    const publicClient = viemCreatePublicClient({ transport, chain });

    // check if chainId matches
    const chainId = await publicClient.getChainId();
    if (chainId !== chain.id) {
        throw new Error(
            "Chain of provided RPC URL does not match selected chain"
        );
    }
    return publicClient;
};

const createWalletClient = async (
    options: EthereumPromptOptions,
    chain: Chain,
    transport: HttpTransport
) => {
    // user provided mnemonic, default to localhost mnemonic if chain id is 31337, or user input mnnemonic
    const mnemonic =
        options.mnemonicPassphrase ||
        (chain.id === 31337
            ? DEFAULT_DEVNET_MNEMONIC
            : await input({
                  message: "Mnemonic",
              }));
    const account = mnemonicToAccount(mnemonic, {
        accountIndex: options.mnemonicIndex,
    });

    // create wallet client
    const walletClient = viemCreateWalletClient({
        account,
        transport,
        chain,
    });
    return walletClient;
};

const createClients = async (
    options: EthereumPromptOptions
): Promise<{ publicClient: PublicClient; walletClient: WalletClient }> => {
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
