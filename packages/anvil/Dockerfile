# syntax=docker.io/docker/dockerfile:1.4
FROM debian:bookworm-20230814-slim

# install curl and jq (for healthcheck support)
RUN <<EOF
apt-get update
DEBIAN_FRONTEND="noninteractive" apt-get install -y --no-install-recommends ca-certificates curl git jq xxd
rm -rf /var/lib/apt/lists/*
EOF

# download pre-compiled binaries
ARG ANVIL_VERSION=5b7e4cb3c882b28f3c32ba580de27ce7381f415a
RUN curl -sSL https://github.com/foundry-rs/foundry/releases/download/nightly-${ANVIL_VERSION}/foundry_nightly_linux_$(dpkg --print-architecture).tar.gz | \
    tar -zx -C /usr/local/bin

# healthcheck script using net_listening JSON-RPC method
COPY eth_isready /usr/local/bin
COPY eth_dump /usr/local/bin
COPY eth_load /usr/local/bin

HEALTHCHECK CMD eth_isready

CMD ["anvil"]
