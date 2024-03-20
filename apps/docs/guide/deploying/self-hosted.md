# Self-hosted deployment

This method of deployment allows the developer to run his own infrastructure to host the application node. The developer will need the following:

1. a server connected to the internet (i.e. cloud server);
2. a postgres database reachable from the server;
3. a web3 provider;
4. a wallet with funds of the [base layer of choice](./supported-networks.md).

## Deploying

The self-hosted deployment process can be initiated by the `sunodo deploy --hosting self-hosted` command.

That command will show the Cartesi machine hash and build a Docker image containing the Cartesi rollups node and the Cartesi machine:

```shell
$ sunodo deploy --hosting self-hosted
? Cartesi machine templateHash 0xc87999b8a93609268b10de25f2e49d35f80fad92813310edc585ed644a9805d3
? Application node Docker image sha256:5c355a9bddc92aa08987f395a257a0b32a51552c969eb161386e46f9380ea2ac
```

The image produced, in this example `sha256:5c355a...0ea2ac`, can be tagged and pushed to a Docker registry of choice, like Docker Hub, or any other private or public registry.

The next step is to deploy the smart contract for the application. The deploy command will redirect the developer to a web application, where he can use a wallet to deploy the required smart contracts.

![deploy self-hosted](./self-hosted-web.png)

## Wallet

The developer will need a wallet that will be used by the Cartesi rollups node to submit transactions to the base layer. This wallet should ideally be used exclusively for that purpose.

A new wallet can be created using a tool like [cast](https://book.getfoundry.sh/reference/cast/cast-wallet-new-mnemonic). A wallet managed by [AWS KMS](https://aws.amazon.com/blogs/database/part1-use-aws-kms-to-securely-manage-ethereum-accounts/) is also supported for an increased level of security.

::: warning
The deployment web application needs the wallet PUBLIC ADDRESS only!
DON'T provide your mnemonic passphrase or private key.
:::

After the successful execution of the deployment transaction the developer is presented with information for the execution of the rollups node:

![deploy self-hosted config](./self-hosted-deployed-env.png)

The configuration for the node is presented in a `.env` file format. It includes the addresses of the deployed smart contracts, as well as information of the base layer chain.

::: warning
The values in the `.env` file must NOT be between double quotes `""`
:::

Three pieces of information are still missing though: the database connection string, the web3 provider URLs, and the wallet private key. The developer can download the configuration as an `.env` file and fill in the missing information.

The wallet private key, in the format of a mnemonic passphrase, must be configured as the `CARTESI_AUTH_MNEMONIC` environment variable.

::: warning
The mnemonic passphrase is a sensitive information. The developer should take care to keep it secure, like using a secret mechanism provided by the cloud provider of choice.
:::

## PostgreSQL database

The rollups node requires a PostgreSQL database to store information about the application state, which is served via the GraphQL API.

The developer can use any PostgreSQL database, either managed by a cloud provider, or run on his own infrastructure. The only configuration that must be provided is the connection string, which includes the database URL, username, password, and database name. If the developer decides to host his own database he must take care of security and maintenance, like regular backups and updates.

The connection string must be configured as an environment variable called `CARTESI_POSTGRES_ENDPOINT`.

::: warning
The database connection string, which includes the password, is a sensitive information. The developer should take care to keep it secure, like using a secret mechanism provided by the cloud provider of choice.
:::

The developer doesn't need to create the database schema, as the rollups node will do it automatically when it starts.

## Web3 provider

The rollups node needs a connection to the base layer through a standard JSON-RPC API endpoint. It requires both an HTTP endpoint as well as a WebSocket endpoint.

The developer can use any Web3 third-party provider, or of course run his own base layer node. The following are examples of service providers:

-   [Alchemy](https://www.alchemy.com)
-   [Infura](https://infura.io)
-   [Ankr](https://www.ankr.com)
-   [QuickNode](https://www.quicknode.com)
-   [GetBlock](https://getblock.io)

Each service has its own characteristics and pricing, and the developer should choose the one that best fits his needs. Any of them should work with the rollups node, but the first two are the most battle-tested.

The URLs for the HTTP and WebSocket endpoints must be configured as environment variables called `CARTESI_BLOCKCHAIN_HTTP_ENDPOINT` and `CARTESI_BLOCKCHAIN_WS_ENDPOINT`, respectively.

::: warning
The Web3 provider URLs can be sensitive information, if they can be private URLs the developer is paying for. The developer should take care to keep it secure, like using a secret mechanism provided by the cloud provider of choice.
:::

## Cloud server

The developer will need a server to host the application node and run it 24/7. This server will expose a single port to the internet, so client applications, like front-ends, can consume the rollups node APIs through [GraphQL](https://docs.cartesi.io/cartesi-rollups/api/graphql/index/) or [Inspect](https://docs.cartesi.io/cartesi-rollups/api/inspect/inspect/) requests.

The server minimum requirements will depend on the expected usage of the application and on the specifications of the Cartesi machine in use, like its RAM size and total size. The developer will have to experiment with different configurations to find the best fit for his needs. We suggest starting with a minimum of 8GB of RAM, and scaling up vertically as needed.

The Cartesi rollups node is distributed as a Docker image, so the server will need to have Docker installed. Any popular cloud provider, like AWS, GCP, Azure, Digital Ocean, or Linode, is capable of running docker containers, either manually by spawing a server and running docker, or by using a managed container infrastructure like Kubernetes.

The developer can also use a service like [Fly.io](https://fly.io) to deploy the application node.

We will describe below two methods of running a rollups node, the first using Docker, which can be used as the basic information to use any cloud provider, and the second using [Fly.io](https://fly.io), a managed service for running Docker containers.

### Using Docker in any cloud provider

Assuming the developer completed the above requirements, and has a complete `.env` file, he can run the rollups node using the following command:

```shell
$ docker run --env-file <env-file> -p 10000:10000 <image-id>
(...)
INFO http: listening at [::]:10000
(...)
INFO rollups-node: all services are ready
(...)
```

In the examples above the `<env-file>` file is `0xc87999b8a93609268b10de25f2e49d35f80fad92813310edc585ed644a9805d3.env` and the `<image-id>` is `sha256:5c355a9bddc92aa08987f395a257a0b32a51552c969eb161386e46f9380ea2ac`.

The image can be tagged with any name by using [docker tag](https://docs.docker.com/reference/cli/docker/image/tag/).

The developer is free to use any managed container solution, like Kubernetes. The rollups node is just a single container, with a single exposed port, that must be accessible from the internet.

### Using fly.io

[Fly.io](https://fly.io) is platform as a service that allows developers to easily deploy applications packaged as Docker containers. To deploy the rollups node to Fly.io, choose an `<app-name>` and follow the steps below:

1. [Install the flyctl CLI](https://fly.io/docs/hands-on/install-flyctl/)
2. [Create an account and login](https://fly.io/docs/hands-on/sign-up-sign-in/)
3. Create an application:

    ```shell
    $ fly app create <app-name>
    New app created: <app-name>
    ```

4. Create a postgres database application:

    ```shell
    fly postgres create --initial-cluster-size 1 --name <app-name>-database --vm-size shared-cpu-1x --volume-size 1
    ```

5. Attach database to the node application:

    ```shell
    fly postgres attach <app-name>-database -a <app-name>
    ```

6. Download `fly.toml` file from deployment and move it to your application directory:

    ![deploy self-hosted config](./self-hosted-deployed-fly.png)

7. Edit the `fly.toml` file to change all ocurrences of `<app-name>` to the name of your application;

8. Create secrets for sensitive configuration, replacing with the actual values:

    ```shell
    fly secrets set -a <app-name> CARTESI_BLOCKCHAIN_HTTP_ENDPOINT=<web3-provider-http-endpoint>
    fly secrets set -a <app-name> CARTESI_BLOCKCHAIN_WS_ENDPOINT=<web3-provider-ws-endpoint>
    fly secrets set -a <app-name> CARTESI_AUTH_MNEMONIC=<mnemonic>
    fly secrets set -a <app-name> CARTESI_POSTGRES_ENDPOINT=<connection_string>
    ```

    The value of the `connection_string` was provided by step 4.

9. Deploy the node:

    Tag the image produced in the beginning of the process and push it to the Fly.io registry:

    ::: warning
    If you are using macOS with Apple Silicon and are deploying to Fly.io you may need to produce a Docker image for the architecture used by Fly.io, which is `linux/amd64`. You can use the following command to build the image: `sunodo deploy build --platform linux/amd64`
    :::

    ```shell
    flyctl auth docker
    docker image tag <image-id> registry.fly.io/<app-name>
    docker image push registry.fly.io/<app-name>
    fly deploy
    ```
