# syntax=docker.io/docker/dockerfile:1.4
FROM debian:bullseye-20230320-slim

# install curl and jq (for healthcheck support)
RUN <<EOF
apt-get update
DEBIAN_FRONTEND="noninteractive" apt-get install -y --no-install-recommends ca-certificates curl jq
rm -rf /var/lib/apt/lists/*
EOF

# download pre-compiled binaries
RUN curl -sSL https://github.com/foundry-rs/foundry/releases/download/nightly/foundry_nightly_linux_$(dpkg --print-architecture).tar.gz | \
    tar -zx -C /usr/local/bin

# healthcheck script using net_listening JSON-RPC method
COPY eth_isready /usr/local/bin

HEALTHCHECK CMD eth_isready

ENTRYPOINT ["/usr/local/bin/anvil"]