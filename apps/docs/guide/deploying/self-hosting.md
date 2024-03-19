# Self-hosted deployment

This method of deployment allows the developer to run his own infrastructure to host the application node. The developer will need the following:

1. a server connected to the internet (i.e. cloud server);
2. a postgres database reachable from the server;
3. a web3 provider;
4. a wallet with funds of the [base layer of choice](./supported-networks.md).

## Deploy

The self-hosted deployment process can be initiated by the `sunodo deploy --hosting self-hosted` command.

That command will show the Cartesi machine hash and build a Docker image containing the Cartesi rollups node and the Cartesi machine inside:

```shell
$ sunodo deploy --hosting self-hosted
? Cartesi machine templateHash 0xc87999b8a93609268b10de25f2e49d35f80fad92813310edc585ed644a9805d3
? Application node Docker image sha256:5c355a9bddc92aa08987f395a257a0b32a51552c969eb161386e46f9380ea2ac
```

The image produced, in this example `sha256:5c355a...0ea2ac`, can be tagged and pushed to a Docker registry of choice, like Docker Hub, or any other private or public registry.

The next step is to deploy the smart contract for the application, explained at the [previous section](./deploying-application.md). The command will redirect the developer to a web application, where he can use a wallet to deploy the required smart contracts.

## Cloud server

The developer will need a server to host the application node and run it 24/7. This server will expose a single port to the internet, so client applications, like front-ends, can consume the rollups node APIs through [GraphQL](https://docs.cartesi.io/cartesi-rollups/api/graphql/index/) or [Inspect](https://docs.cartesi.io/cartesi-rollups/api/inspect/inspect/) requests.

The server minimum requirements will depend on the expected usage of the application and on the specifications of the Cartesi machine in use, like its RAM size and total size. The developer will have to experiment with different configurations to find the best fit for his needs. We suggest starting with a minimum of 8GB of RAM, and scaling up vertically as needed.

The Cartesi rollups node is distributed as a Docker image, so the server will need to have Docker installed. Any popular cloud provider, like AWS, GCP, Azure, Digital Ocean, or Linode, is capable of running docker containers, either manually by spawing a server and running docker, or by using a managed Docker infrastructure like Kubernetes.

The developer can also use a service like [Fly.io](https://fly.io) to deploy the application node.

We will describe below two methods of running a rollups node, the first using Docker, which can be used as the basic information to use any cloud provider, and the second using [Fly.io](https://fly.io), a managed service for running Docker containers.

### Using docker in any cloud provider

### Using fly.io

## PostgreSQL database

## Web3 provider

The rollups node need a connection to base layer through a standard JSON-RPC API endpoint. It requires both a HTTP endpoint as well as a WebSocket endpoint.

The developer can use any Web3 third-party provider, or of course run his own base layer node. The following are examples of service providers, in no particular order:

-   [Alchemy](https://www.alchemy.com)
-   [Infura](https://infura.io)
-   [Ankr](https://www.ankr.com)
-   [QuickNode](https://www.quicknode.com)
-   [GetBlock](https://getblock.io)

Each service has its own characteristics and pricing, and the developer should choose the one that best fits his needs. Any of them should work with the rollups node, even if the first two are the most tested with.

## Wallet

## Fly.io
