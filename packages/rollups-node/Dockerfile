# syntax=docker.io/docker/dockerfile:1.4
ARG REGISTRY=docker.io
ARG ORG=cartesi
ARG ROLLUPS_VERSION

FROM ${REGISTRY}/${ORG}/rollups-node:${ROLLUPS_VERSION}

USER root

ARG DEBIAN_FRONTEND="noninteractive"
RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends \
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

RUN <<EOF
    mkdir -p /var/opt/cartesi/machine-snapshots/0_0
    ln -s /var/opt/cartesi/machine-snapshots/0_0 /var/opt/cartesi/machine-snapshots/latest
    mkdir -p /var/opt/cartesi/rollups-dispatcher
    chown -R cartesi:cartesi /var/opt/cartesi/rollups-dispatcher
EOF

COPY ./s6-overlay/s6-rc.d /etc/s6-overlay/s6-rc.d
COPY ./s6-overlay/stage2-hook.sh /etc/s6-overlay/scripts/stage2-hook.sh
COPY ./is_ready /usr/local/bin/
COPY ./address_book /usr/local/bin/
COPY ./entrypoint.sh /entrypoint.sh

HEALTHCHECK --interval=60s --start-period=5s --retries=5 CMD [ "/usr/local/bin/is_ready" ]

WORKDIR /opt/cartesi
EXPOSE 4000
EXPOSE 5004
EXPOSE 5005
ENTRYPOINT ["/entrypoint.sh"]
