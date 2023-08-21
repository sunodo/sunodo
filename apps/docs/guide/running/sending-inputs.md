# Sending inputs

Applications receive inputs by sending transactions with the input payload to the `InputBox` smart contracts of the Cartesi rollups framework. To facilitate this process, we provide a CLI command to send inputs to a running application. The command below will guide you through an interactive process:

```shell
sunodo send
```

To be more specific, there are 5 types of inputs you can send using a sub-command: `dapp-address`, `erc20`, `erc721`, `ether`, `generic`. These are detailed below:

## DApp Address

This input is useful for applications that need to know its own address. The input payload is simply the address of the application and the sender is the `DAppAddressRelay` smart contract.

```shell
sunodo send dapp-address
```

## ERC-20 Deposit

This input deposits ERC-20 tokens to the application. Refer to the `ERC20Portal` documentation to understand the input payload format and how to decode it.

```shell
sunodo send erc20
```

## ERC-721 Deposit

This input deposits ERC-721 tokens (NFT) to the application. Refer to the `ERC721Portal` documentation to understand the input payload format and how to decode it.

```shell
sunodo send erc721
```

## Ether Deposit

This input deposits Ether (native token) to the application. Refer to the `EtherPortal` documentation to understand the input payload format and how to decode it.

```shell
sunodo send ether
```

## Generic Input

The input types above are specialized inputs with a pre-defined payload format and a trusted sender (a smart contract), but they all send inputs to the `InputBox`. The generic input allows you to send inputs with any payload format.

```shell
sunodo send generic
```

The encoding of the payload, from what you specify in the CLI to the raw bytes the `InputBox` expects, can be specified with the `--input-encoding` option. We currently support the following encodings:

-   hex: the user input is parsed as a hex-string and converted to bytes.
-   string: the user input is converted from a utf-8 string to bytes
-   abi: allows the user to specify an abi encoded input format in a human-readable format, i.e. `address token,uint256 tokenId`, and the input values decoded accordinly, as from the input `0x491604c0FDF08347Dd1fa4Ee062a822A5DD06B5D,100000` in this particular example.
