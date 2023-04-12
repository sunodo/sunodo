# sunodo-registry

This application is a simple registry for sunodo, to be deployed at fly.io.

## Requirements

- fly.io account;
- flyctl CLI installed and configured;

## Quick Start

```shell
flyctl deploy
```

Follow the instructions at `./tf/README.md` to deploy the infrastructure needed by the registry to store.

After the infrastructure is deployed, you need to set the secrets for the registry to access the S3 bucket.

```shell
fly secrets \
    --app sunodo-registry \
    set \
    REGISTRY_STORAGE_S3_ACCESSKEY=$(jq -r '.resources[] | select(.type=="aws_iam_access_key") | .instances[].attributes.id' terraform.tfstate) \
    REGISTRY_STORAGE_S3_SECRETKEY=$(jq -r '.resources[] | select(.type=="aws_iam_access_key") | .instances[].attributes.secret' terraform.tfstate)
```

## Quick Destroy

```shell
flyctl apps destroy --app sunodo-registry
```
