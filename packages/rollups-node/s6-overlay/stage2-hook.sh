#!/command/with-contenv sh
set -e

if [ "${CARTESI_FEATURE_HOST_MODE}" = "true" ]; then
    rm /etc/s6-overlay/s6-rc.d/rollups-node/dependencies.d/snapshot-provisioner
fi