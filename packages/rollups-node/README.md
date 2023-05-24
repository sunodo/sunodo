# Rollups Node

This package contains the code the `sunodo/rollups-node` container image, which bundles together all the components needed to run a Cartesi Node inside a single container.

## Downloading

The `sunodo/rollups-node` image is published to both `docker.io` and `ghcr.io` registries.

For ex.:

```shell
docker pull ghcr.io/sunodo/rollups-node:0.1.0
docker pull sunodo/rollups-node:latest
```

## Running

This image is made to be used by the `sunodo` CLI tool, which is the recommended way to run a Cartesi Node for local development.

See [../../apps/cli/README.md](sundo CLI) docs for more information.

## Building

To build the `sunodo/rollups-node` container image yourself, you should first export the contracts.

```shell
cd packages/rollups-node
./export-deployments.sh
```

The file `.env` contains environment variables used in the process, in case you need to tweak them.

```shell
cd packages/rollups-node
docker buildx bake --load
```
