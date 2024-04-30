# Deploying application

The deployment of a Cartesi rollups application has two main components: a Cartesi genesis machine, and a smart contract deployed to the [base layer of choice](./supported-networks.md).

## Cartesi machine

The Cartesi genesis machine is produced by the [cartesi build](../building/building-application.md) command, and must be installed alongside a Cartesi [rollups node](https://github.com/cartesi/rollups-node). The machine contains a hash that represents the initial state of the application (including the application itself). The hash can be obtained using the `cartesi hash` command:

```shell
$ cartesi hash
? Cartesi machine templateHash 0xc87999b8a93609268b10de25f2e49d35f80fad92813310edc585ed644a9805d3
```

Any changes to the application code will result in a different hash, and hence will require a different deployment.

::: info
Upgradability of applications is a research topic and requires further discussions.
:::

## Smart contract

The smart contract that represents the application on the base layer can be deployed using the [CartesiDAppFactory](https://github.com/cartesi/rollups-contracts/blob/v1.2.0/onchain/rollups/contracts/dapp/CartesiDAppFactory.sol) smart contract.

The following sections will describe two convenience methods to deploy an application:

1. [Self-hosted deployment](./self-hosted.md): this method allows the developer to deploy the application node using their own infrastructure;
2. [Third-party service provider](./provider.md): this method allows the developer to select a service provider to run the application node on their behalf.
