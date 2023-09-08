#!/command/with-contenv sh

# check whether to use host-runner or not
if [ ! -z ${ENABLE_SUNODO_NODE+x} ]; then
    /command/s6-echo "host-runner: ENABLE_SUNODO_NODE is set, running in host mode..."
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
    /command/s6-echo "host-runner: ENABLE_SUNODO_NODE is not set, skip the host mode..."
    sed -i '/host-runner/d' /usr/local/bin/is_ready
    rm /etc/traefik/conf.d/host-runner.yaml
fi
