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

FROM cartesi/server-manager:0.8.2
USER root

RUN <<EOF
apt-get update
DEBIAN_FRONTEND="noninteractive" apt-get install -y --no-install-recommends \
    apt-transport-https \
    ca-certificates \
    curl \
    jq \
    libpq5 \
    xz-utils
rm -rf /var/lib/apt/lists/*
EOF

ARG S6_OVERLAY_VERSION=3.1.5.0
RUN <<EOF
tmp_dir=$(mktemp -d)
ARCH=$(arch)
curl -sSL https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz \
    -o "$tmp_dir"/s6-overlay-noarch.tar.xz
curl -sSL https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz.sha256 \
    -o "$tmp_dir"/s6-overlay-noarch.tar.xz.sha256
curl -sSL https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-${ARCH}.tar.xz \
    -o "$tmp_dir"/s6-overlay-${ARCH}.tar.xz
curl -sSL https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-${ARCH}.tar.xz.sha256 \
    -o "$tmp_dir"/s6-overlay-${ARCH}.tar.xz.sha256
cd "$tmp_dir"
sha256sum --check "$tmp_dir"/*.sha256
tar -Jxpf "$tmp_dir"/s6-overlay-noarch.tar.xz -C /
tar -Jxpf "$tmp_dir"/s6-overlay-${ARCH}.tar.xz -C /
cd -
rm -rf "$tmp_dir"
EOF

ARG TRAEFIK_VERSION=2.10.1
RUN <<EOF
tmp_dir=$(mktemp -d)
ARCH=$(dpkg --print-architecture)
curl -sSL https://github.com/traefik/traefik/releases/download/v${TRAEFIK_VERSION}/traefik_v${TRAEFIK_VERSION}_linux_${ARCH}.tar.gz \
    -o "$tmp_dir"/traefik_v${TRAEFIK_VERSION}_linux_${ARCH}.tar.gz
curl -sSL https://github.com/traefik/traefik/releases/download/v${TRAEFIK_VERSION}/traefik_v${TRAEFIK_VERSION}_checksums.txt | \
     grep "traefik_v${TRAEFIK_VERSION}_linux_${ARCH}.tar.gz" > "$tmp_dir"/traefik_v${TRAEFIK_VERSION}_checksums.txt
sha256sum "$tmp_dir"/traefik_v${TRAEFIK_VERSION}_checksums.txt --check
tar -xvzf "$tmp_dir"/traefik_v${TRAEFIK_VERSION}_linux_${ARCH}.tar.gz -C "$tmp_dir"/
cp "$tmp_dir"/traefik /usr/local/bin/traefik
rm -rf "$tmp_dir"
EOF

COPY --from=state_server    /opt/cartesi/bin/cartesi-rollups-state-server   /usr/bin/cartesi-rollups-state-server
COPY --from=indexer         /opt/cartesi/bin/cartesi-rollups-indexer        /usr/bin/cartesi-rollups-indexer
COPY --from=dispatcher      /opt/cartesi/bin/cartesi-rollups-dispatcher     /usr/bin/cartesi-rollups-dispatcher
COPY --from=advance_runner  /opt/cartesi/bin/cartesi-rollups-advance-runner /usr/bin/cartesi-rollups-advance-runner
COPY --from=inspect_server  /opt/cartesi/bin/cartesi-rollups-inspect-server /usr/bin/cartesi-rollups-inspect-server
COPY --from=graphql_server  /opt/cartesi/bin/cartesi-rollups-graphql-server /usr/bin/cartesi-rollups-graphql-server

RUN mkdir -p /var/opt/cartesi/machine-snapshots/0_0 && ln -s /var/opt/cartesi/machine-snapshots/0_0 /var/opt/cartesi/machine-snapshots/latest

COPY ./traefik /etc/traefik
COPY ./s6-overlay /etc/s6-overlay
COPY ./is_ready /usr/local/bin/
COPY ./address_book /usr/local/bin/
COPY ./entrypoint.sh /entrypoint.sh

HEALTHCHECK --interval=60s --start-period=5s --retries=5 CMD [ "/usr/local/bin/is_ready" ]

WORKDIR /opt/cartesi
EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
