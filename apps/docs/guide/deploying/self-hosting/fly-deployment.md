# Deploying the validator node at fly.io

If you wanna run the validator node at fly.io, you can follow the steps below.

Install the flyctl CLI following instructions at https://fly.io/docs/hands-on/install-flyctl/

Then, you can run the following command to deploy the validator node:

Create an account and login to fly.io:

```shell
fly auth signup
fly auth login
```

Create an application:

```shell
fly app create $(sunodo hash --json)
```

Create the database application and attach it to the validator node application:

```shell
fly postgres create \
 --initial-cluster-size 1 \
 --name $(sunodo hash)-database \
 --vm-size shared-cpu-1x \
 --volume-size 1
fly postgres attach bug-less-database -a $(sunodo hash --json)
```

Create the fly.toml file:

```shell
cat <<EOF > fly.toml
app = "$(sunodo hash --json)"

[http_service]
internal_port = 10000
force_https = true

[http_service.concurrency]
type = "requests"
soft_limit = 200
hard_limit = 250

[[http_service.checks]]
grace_period = "10s"
interval = "30s"
method = "GET"
timeout = "5s"
path = "/healthz"

[env]
CARTESI_HTTP_PORT = "10000"
CARTESI_HTTP_ADDRESS = "0.0.0.0"
CARTESI_BLOCKCHAIN_ID = "11155111"
CARTESI_BLOCKCHAIN_FINALITY_OFFSET = "1"
CARTESI_CONTRACTS_APPLICATION_ADDRESS = "0x5c7A258c4B833B31D51f105F8dEb5A5233156cf9"
CARTESI_CONTRACTS_APPLICATION_DEPLOYMENT_BLOCK_NUMBER = "5382002"
CARTESI_CONTRACTS_HISTORY_ADDRESS = "0x19558bc901C21f7C81a582999cA786B7018087d3"
CARTESI_CONTRACTS_AUTHORITY_ADDRESS = "0x5D1B6D937Dd1c75Ed1a681e12834cb629caae705"
CARTESI_CONTRACTS_INPUT_BOX_ADDRESS = "0x59b22D57D4f067708AB0c00552767405926dc768"
CARTESI_CONTRACTS_INPUT_BOX_DEPLOYMENT_BLOCK_NUMBER = "3963384"
CARTESI_EPOCH_DURATION = "86400"

# SECRETS
# CARTESI_BLOCKCHAIN_HTTP_ENDPOINT=
# CARTESI_BLOCKCHAIN_WS_ENDPOINT=
# CARTESI_AUTH_MNEMONIC=
# CARTESI_POSTGRES_ENDPOINT=
EOF
```

Create the screts:

```
fly secrets set CARTESI_BLOCKCHAIN_HTTP_ENDPOINT=<web3-provider-http-endpoint>
fly secrets set CARTESI_BLOCKCHAIN_WS_ENDPOINT=<web3-provider-ws-endpoint>
fly secrets set CARTESI_AUTH_MNEMONIC=<wallet-mnemonic>
fly secrets set CARTESI_POSTGRES_ENDPOINT=
```

Then, you can run the following command to deploy the validator node:

```shell
flyctl auth docker
docker image tag application:$(sunodo hash --json) registry.fly.io/$(sunodo hash --json)
docker image push registry.fly.io/$(sunodo hash --json)
```
