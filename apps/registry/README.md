# sunodo-registry

This application is a simple registry for sunodo, to be deployed at fly.io.

## Requirements

- fly.io account;
- flyctl CLI installed and configured;

## Quick Start

```shell
flyctl apps deploy --app sunodo-registry --org sunodo
```

Follow the instructions at ./tf/README.md to deploy the infrastructure needed by the registry to store.

Then define the following secrets:

```shell
fly secrets \
    --app sunodo-registry \
    --org sunodo \
    set \
    AWS_ACCESS_KEY_ID=... \
    AWS_SECRET_ACCESS_KEY=... \
```

## Quick Destroy

```shell
flyctl apps destroy --app sunodo-registry --org sunodo
```
