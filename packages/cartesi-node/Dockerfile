# syntax=docker.io/docker/dockerfile:1.4

ARG ROLLUPS_VERSION
FROM cartesi/rollups-indexer:${ROLLUPS_VERSION}         AS indexer
FROM cartesi/rollups-state-server:${ROLLUPS_VERSION}    AS state_server
FROM cartesi/rollups-dispatcher:${ROLLUPS_VERSION}      AS dispatcher
FROM cartesi/rollups-advance-runner:${ROLLUPS_VERSION}  AS advance_runner
FROM cartesi/rollups-inspect-server:${ROLLUPS_VERSION}  AS inspect_server
FROM cartesi/rollups-graphql-server:${ROLLUPS_VERSION}  AS graphql_server

# not a public image yet
# git clone git@github.com/cartesi-corp/machine-emulator
# cd machine-emulator
# git checkout feat/debian-based-image
# docker buildx build -t cartesi/server-manager:bullseye -f .github/workflows/Dockerfile .
FROM cartesi/server-manager:bullseye

RUN <<EOF
apt-get update
DEBIAN_FRONTEND="noninteractive" apt-get install -y --no-install-recommends \
    apt-transport-https \
    ca-certificates \
    curl \
    libpq5 \
    postgresql-13 \
    redis-server \
    xz-utils
rm -rf /var/lib/apt/lists/*
EOF

ARG S6_OVERLAY_VERSION=3.1.4.1
ARG CADDY_VERSION=2.6.4

RUN <<EOF
curl -sSL https://github.com/caddyserver/caddy/releases/download/v${CADDY_VERSION}/caddy_${CADDY_VERSION}_linux_$(dpkg --print-architecture).tar.gz | tar -xz -C /usr/local/bin caddy
/usr/local/bin/caddy version

curl -sSL https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz | tar -Jxp -C /
curl -sSL https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-$(arch).tar.xz | tar -Jxp -C /
EOF

# FIXME: use a public release (ex. cartesi-corp/rollups-state-server:0.9.0)
COPY --from=state_server    /usr/local/bin/grpc-health-probe      /usr/local/bin/grpc-health-probe
COPY --from=state_server    /opt/cartesi/bin/rollups_state_server /opt/cartesi/bin/rollups_state_server
COPY --from=indexer         /opt/cartesi/bin/indexer              /opt/cartesi/bin/indexer
COPY --from=dispatcher      /opt/cartesi/bin/rollups_dispatcher   /opt/cartesi/bin/rollups_dispatcher
COPY --from=advance_runner  /opt/cartesi/bin/advance-runner       /opt/cartesi/bin/advance-runner
COPY --from=inspect_server  /opt/cartesi/bin/inspect-server       /opt/cartesi/bin/inspect-server
COPY --from=graphql_server  /opt/cartesi/bin/graphql-server       /opt/cartesi/bin/graphql-server

RUN mkdir -p /opt/cartesi/share/dapp-bin/0_0 && ln -s /opt/cartesi/share/dapp-bin/0_0 /opt/cartesi/share/dapp-bin/latest

COPY Caddyfile /Caddyfile
COPY ./s6-overlay /etc/s6-overlay
COPY ./entrypoint.sh /entrypoint.sh

# TODO: we should see if this will work with s6-overlay, since the supervisor might need to run as root
#RUN useradd --user-group --system --create-home --no-log-init -d /opt/cartesi -u 1001 cartesi
#USER cartesi

ENV PATH=/opt/cartesi/bin:$PATH
WORKDIR /opt/cartesi

EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
