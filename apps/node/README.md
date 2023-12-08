# Sunodo Node

## Running

```shell
brew install redis

export CARTESI_HOME=$HOME/Documents/workspace/cartesi
export PATH=$PATH:$CARTESI_HOME/rollups-node
export PATH=$PATH:$CARTESI_HOME/rollups-node/offchain/target/debug
export PATH=$PATH:$CARTESI_HOME/server-manager/src
export PATH=$PATH:$CARTESI_HOME/machine-emulator/src
```

```shell
docker run -p 8545:8545 -e ANVIL_IP_ADDR=0.0.0.0 sunodo/devnet:latest
tsx src/cli.ts --port 3000
```
