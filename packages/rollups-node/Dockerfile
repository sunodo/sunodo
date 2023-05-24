# syntax=docker.io/docker/dockerfile:1.4
ARG REGISTRY=docker.io
ARG ORG=cartesi
ARG ROLLUPS_VERSION
FROM ${REGISTRY}/${ORG}/rollups-indexer:${ROLLUPS_VERSION}         AS indexer
FROM ${REGISTRY}/${ORG}/rollups-state-server:${ROLLUPS_VERSION}    AS state_server
FROM ${REGISTRY}/${ORG}/rollups-dispatcher:${ROLLUPS_VERSION}      AS dispatcher
FROM ${REGISTRY}/${ORG}/rollups-advance-runner:${ROLLUPS_VERSION}  AS advance_runner
FROM ${REGISTRY}/${ORG}/rollups-inspect-server:${ROLLUPS_VERSION}  AS inspect_server
FROM ${REGISTRY}/${ORG}/rollups-graphql-server:${ROLLUPS_VERSION}  AS graphql_server

FROM cartesi/server-manager:0.7.0-bullseye
USER root

RUN <<EOF
apt-get update
DEBIAN_FRONTEND="noninteractive" apt-get install -y --no-install-recommends \
    apt-transport-https \
    ca-certificates \
    curl \
    libpq5 \
    xz-utils
rm -rf /var/lib/apt/lists/*
EOF

ARG S6_OVERLAY_VERSION=3.1.4.1
RUN <<EOF
curl -sSL https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz | tar -Jxp -C /
curl -sSL https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-$(arch).tar.xz | tar -Jxp -C /
EOF

ARG TRAEFIK_VERSION=2.10.1
RUN <<EOF
tmp_dir=$(mktemp -d)
ARCH=$(dpkg --print-architecture)
curl -sSL https://github.com/traefik/traefik/releases/download/v${TRAEFIK_VERSION}/traefik_v${TRAEFIK_VERSION}_linux_${ARCH}.tar.gz -o "$tmp_dir"/traefik_v${TRAEFIK_VERSION}_linux_${ARCH}.tar.gz
curl -sSL https://github.com/traefik/traefik/releases/download/v${TRAEFIK_VERSION}/traefik_v${TRAEFIK_VERSION}_checksums.txt | \
     grep "traefik_v${TRAEFIK_VERSION}_linux_${ARCH}.tar.gz" > "$tmp_dir"/traefik_v${TRAEFIK_VERSION}_checksums.txt
sha256sum "$tmp_dir"/traefik_v${TRAEFIK_VERSION}_checksums.txt --check
tar -xvzf "$tmp_dir"/traefik_v${TRAEFIK_VERSION}_linux_${ARCH}.tar.gz -C "$tmp_dir"/
cp "$tmp_dir"/traefik /usr/local/bin/traefik
rm -rf "$tmp_dir"
EOF

COPY --from=state_server    /opt/cartesi/bin/rollups_state_server /opt/cartesi/bin/rollups_state_server
COPY --from=indexer         /opt/cartesi/bin/indexer              /opt/cartesi/bin/indexer
COPY --from=dispatcher      /opt/cartesi/bin/rollups_dispatcher   /opt/cartesi/bin/rollups_dispatcher
COPY --from=advance_runner  /opt/cartesi/bin/advance-runner       /opt/cartesi/bin/advance-runner
COPY --from=inspect_server  /opt/cartesi/bin/inspect-server       /opt/cartesi/bin/inspect-server
COPY --from=graphql_server  /opt/cartesi/bin/graphql-server       /opt/cartesi/bin/graphql-server

RUN mkdir -p /var/opt/cartesi/machine-snapshots/0_0 && ln -s /var/opt/cartesi/machine-snapshots/0_0 /var/opt/cartesi/machine-snapshots/latest

COPY ./traefik /etc/traefik
COPY ./s6-overlay /etc/s6-overlay
COPY ./is_ready /usr/local/bin/is_ready
COPY ./entrypoint.sh /entrypoint.sh
COPY ./deployments /opt/cartesi/share/deployments

HEALTHCHECK --interval=60s --start-period=5s --retries=5 CMD [ "/usr/local/bin/is_ready" ]

WORKDIR /opt/cartesi
EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
