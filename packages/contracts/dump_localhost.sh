#!/usr/bin/env sh
set -e
STATE_FILE="anvil_state.json"

# start anvil in the background, with --dump-state
anvil --dump-state $STATE_FILE &
PID=$!

# wait for anvil to start
sleep 1

# remove previous deployment
rm -rf deployments/localhost
rm -rf export/abi/localhost.json

# deploy project to localhost (anvil)
npx hardhat deploy --network localhost --export export/abi/localhost.json

# kill anvil, gracefully, make it dump the state due to --dump-state
kill "$PID"

ls -al "$STATE_FILE"
ls -al export/abi/localhost.json
