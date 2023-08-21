# Deploying application

The deployment of an application is done in two basic steps:

1. Upload of the application Cartesi machine to IPFS;
2. Instantiation of the application onchain;

The process is illustrated below:

![Deploy](./deploy.jpg)

## Cartesi machine upload

The first step in the deployment process is to make the application Cartesi machine publicly available so the validator can download it and run the application node. Sunodo uses IPFS as a decentralized storage for the Cartesi machine.

Initially the developer must run his own IPFS node and add the Cartesi machine to it. Any IPFS client works fine, including [IPFS Desktop](https://docs.ipfs.tech/install/ipfs-desktop/).

Technically the machine must be packaged as a [CAR file](https://car.ipfs.io), which is a verifiable content-addressed archive. When the developer adds the file to IPFS it gets back a `CID` hash. Different machines produce different IPFS CID hashes.

With the CID in hand the developer can register his application onchain.

## Application instantiation

After obtaining the CID of the Cartesi machine the developer must select a `PayableDAppFactory` and call the `newApplication` method, which requires four parameters:

-   dappOwner: the owner of the deployed application, which has the power to switch the validator;
-   templateHash: the cartesi machine template hash, obtained after `sunodo build`;
-   cid: the IPFS CID hash of the Cartesi machine upload to IPFS;
-   runway: the amount of time to pre-pay for application execution;

Depending on the `runway` parameter the developer must `approve` a certain amount of tokens of the `ERC-20` contract of the `PayableDAppFactory` to the `payee` of the `PayableDAppFactory`.

The amount of tokens can be calculated using the `cost` view method of the `PayableDAppFactory`. For further details check the [billing](./billing.md) section.

## Using the CLI

The command below will guide the developer through an interactive process to deploy the application, including all the steps above.

```shell
sunodo deploy
```

The following wallets are currently supported for signing the necessary onchain transactions:

-   [Metamask](https://metamask.io/download/) for iPhone or Android;
-   Any mobile wallet compatible with [WalletConnect](https://walletconnect.com/explorer?type=wallet).

## Using the Web Application

:::info
The Web Application is currently under development and not yet available.
:::
