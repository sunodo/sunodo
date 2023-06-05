#!/usr/bin/env bash
set -e
STATE_FILE="anvil_state.json"
rm -vf "$STATE_FILE"

# start anvil in the background, with --dump-state
anvil --dump-state $STATE_FILE &
PID=$!
printf "anvil started at PID=%s and saving state to %s\n" "$PID" "$STATE_FILE"

# wait for anvil to start
printf "Waiting for anvil to be available...\n"
while ! echo . /tcp/127.0.0.1/8545; do sleep 1; echo -n "."; done

# remove previous deployment
printf "Cleaning previous deployment...\n"
rm -vrf deployments/localhost
rm -vrf export/abi/localhost.json

# deploy project to localhost (anvil)
printf "Deploying project to local anvil...\n"
yarn
yarn build
npx hardhat deploy --network localhost --export export/abi/localhost.json

# check if file exists
printf "Waiting for abi file to be available...\n"
while test ! -f "./export/abi/localhost.json"; do sleep 1; echo -n "."; done

# kill anvil, gracefully, make it dump the state due to --dump-state
printf "Stopping anvil...\n"
kill -15 "$PID"
printf "anvil stopped.\n"

printf "State files:\n"
ls -al "$STATE_FILE"
ls -al export/abi/localhost.json
