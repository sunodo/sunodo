#!/command/with-contenv sh
set -e

# check whether to use host-runner or not
if [ ! -z ${ENABLE_SUNODO_NODE+x} ]; then
    # add host-runner service and dependencies of the other services
    touch /etc/s6-overlay/s6-rc.d/user/contents.d/host-runner
    touch /etc/s6-overlay/s6-rc.d/inspect-server/dependencies.d/host-runner
    touch /etc/s6-overlay/s6-rc.d/advance-runner/dependencies.d/host-runner
    # remove server-manager and dependencies of the other services
    rm /etc/s6-overlay/s6-rc.d/user/contents.d/server-manager
    rm /etc/s6-overlay/s6-rc.d/inspect-server/dependencies.d/server-manager
    rm /etc/s6-overlay/s6-rc.d/advance-runner/dependencies.d/server-manager
    rm /etc/s6-overlay/s6-rc.d/advance-runner/dependencies.d/snapshot-provisioner
    sed -i '/server-manager/d' /usr/local/bin/is_ready
else
    sed -i '/host-runner/d' /usr/local/bin/is_ready
fi
