# Starting the validator node locally

After deploying the application to the blockchain, the next step is to run the validator node.

Here we'll show the steps needed to run the validator node locally.

## Pre-requisites

You're gonnan need:

-   A PostgreSQL database running;
-   web3 provider URL;
-   A Wallet with funds to pay for the application execution.

To start a local PostgreSQL unsing Docker, you can run the following command:

```shell
$ docker run -d \
    --name sunodo-postgres \
    -e POSTGRES_PASSWORD=postgres \
    -p 5432:5432 \
    postgres:16
```

Make sure you have the HTTP and WebSocket URLs of your web3 provider, they'll be required in the next step as environment variables.

-   `CARTESI_BLOCKCHAIN_HTTP_ENDPOINT`
-   `CARTESI_BLOCKCHAIN_WS_ENDPOINT`

And also the wallet address mnemonic of private key.

-   `CARTESI_AUTH_MNEMONIC`
-   or `CARTESI_AUTH_PRIVATE_KEY`

## Running the validator node

```shell
$ TEMPLATE_HASH=$(sunodo hash --json)
$ docker run -d \
    --name sunodo-validator-node \
    --env DATABASE_URL=postgresql://postgres:postgres@docker.host.internal:5432/postgres \
    --env CARTESI_BLOCKCHAIN_HTTP_ENDPOINT=<web3-provider-http-endpoint> \
    --env CARTESI_BLOCKCHAIN_WS_ENDPOINT=<web3-provider-ws-endpoint> \
    --env CARTESI_AUTH_MNEMONIC=<wallet-mnemonic> \
    --env-file $TEMPLATE_HASH.env \
    application:$TEMPLATE_HASH
```
