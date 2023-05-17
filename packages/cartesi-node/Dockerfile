# syntax=docker.io/docker/dockerfile:1.4
ARG ROLLUPS_VERSION
FROM cartesi/rollups-indexer:${ROLLUPS_VERSION}         AS indexer
FROM cartesi/rollups-state-server:${ROLLUPS_VERSION}    AS state_server
FROM cartesi/rollups-dispatcher:${ROLLUPS_VERSION}      AS dispatcher
FROM cartesi/rollups-advance-runner:${ROLLUPS_VERSION}  AS advance_runner
FROM cartesi/rollups-inspect-server:${ROLLUPS_VERSION}  AS inspect_server
FROM cartesi/rollups-graphql-server:${ROLLUPS_VERSION}  AS graphql_server

FROM debian:bullseye-20230502-slim as su-exec
ENV DEBIAN_FRONTEND=noninteractive
RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends \
    ca-certificates \
    gcc \
    git \
    libc-dev \
    make
git clone --branch v0.2 --depth 1 https://github.com/ncopa/su-exec.git
cd su-exec
if [ `git rev-parse --verify HEAD` != 'f85e5bde1afef399021fbc2a99c837cf851ceafa' ]; then exit 1; fi
make
EOF

FROM cartesi/server-manager:0.7.0-bullseye
USER root

COPY --from=su-exec /su-exec/su-exec /usr/local/bin/su-exec

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

WORKDIR /opt/cartesi
EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
