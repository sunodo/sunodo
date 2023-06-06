#!/usr/bin/env sh

if [ ! -z ${ENABLE_STREAM_CLEANUP+x} ];then
    printf "stream-cleanup: ENABLE_STREAM_CLEANUP is set, cleaning redis streams...\n"
    redis-cli -h ${REDIS_ENDPOINT} DEL chain-${CHAIN_ID}:dapp-${DAPP_CONTRACT_ADDRESS:2}:rollups-claims;
    redis-cli -h ${REDIS_ENDPOINT} DEL chain-${CHAIN_ID}:dapp-${DAPP_CONTRACT_ADDRESS:2}:rollups-inputs;
    redis-cli -h ${REDIS_ENDPOINT} DEL chain-${CHAIN_ID}:dapp-${DAPP_CONTRACT_ADDRESS:2}:rollups-outputs;
fi
