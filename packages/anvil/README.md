# Anvil

## Usage

```shell
docker run sunodo/anvil
```

## Building

```shell
docker buildx bake --load
```

## Export anvil state

Run anvil and deploy any contracts.
Then run:

```shell
./eth_dump
```

The environment variable `RPC_URL` can be defined to control the address of `anvil`, and defaults to `http://127.0.0.1:8545`.
You need the following tools installed:

-   curl
-   jq
-   cut
-   xxd

If you are running `anvil` as a Docker container you can use the following command to export the state to a `.gz` file.

```shell
docker exec <container> eth_dump | gzip > <file.gz>
```

## Load anvil state

Run `anvil` and load the state produced by `eth_dump` above with:

```shell
./eth_load
```

It loads the state reading from `stdin`.
The environment variable `RPC_URL` can be defined to control the address of anvil, and defaults to `http://127.0.0.1:8545`.
