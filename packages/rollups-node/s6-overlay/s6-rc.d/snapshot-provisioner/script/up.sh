#!/usr/bin/env sh
set -e

printf "Provisioning cartesi-machine snapshot...\n"
cp --recursive /tmp/machine-snapshots/0_0/* /var/opt/cartesi/machine-snapshots/0_0/
chown --recursive cartesi:cartesi /var/opt/cartesi/machine-snapshots
