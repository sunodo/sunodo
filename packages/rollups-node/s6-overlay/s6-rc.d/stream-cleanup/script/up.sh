#!/command/with-contenv bash
set -e

if [ ! -z ${DAPP_DEPLOYMENT_FILE+x} ]; then
    _FROM_FILE=$(jq -r '.address | ascii_downcase' ${DAPP_DEPLOYMENT_FILE})
    DAPP_ADDRESS=${_FROM_FILE}
else
    DAPP_ADDRESS=${DAPP_ADDRESS:-}
fi

REDIS_ARGS="-u ${REDIS_ENDPOINT}"
[ ! -z ${REDIS_CLUSTER_MODE+x} ] && REDIS_ARGS="${REDIS_ARGS} -c"
[ ! -z ${REDIS_TLS_MODE:x} ] && REDIS_ARGS="${REDIS_ARGS} --tls"

REDIS_CMD="DEL {chain-${CHAIN_ID}:dapp-${DAPP_ADDRESS:2}}"

redis-cli ${REDIS_ARGS} ${REDIS_CMD}:rollups-claims
redis-cli ${REDIS_ARGS} ${REDIS_CMD}:rollups-inputs
redis-cli ${REDIS_ARGS} ${REDIS_CMD}:rollups-outputs
