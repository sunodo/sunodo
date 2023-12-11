#!/command/with-contenv sh
set -e

mkdir -p "$CARTESI_SNAPSHOT_DIR"
cp --recursive /tmp/snapshot/* "$CARTESI_SNAPSHOT_DIR"
chown --recursive cartesi:cartesi "$CARTESI_SNAPSHOT_DIR"
