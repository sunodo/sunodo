# syntax=docker.io/docker/dockerfile:1.4
ARG MACHINE_EMULATOR_VERSION
ARG LINUX_VERSION
ARG LINUX_KERNEL_VERSION
ARG ROM_VERSION

FROM ubuntu:22.04 as genext2fs

WORKDIR /usr/local/src
RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends autoconf automake ca-certificates curl build-essential libarchive-dev libtool
rm -rf /var/lib/apt/lists/*
curl -sL https://github.com/cartesi/genext2fs/archive/refs/heads/cartesi.tar.gz | tar --strip-components=1 -zxvf -
./autogen.sh
./configure --enable-libarchive
make
make install
EOF

FROM ubuntu:22.04 as su-exec

WORKDIR /usr/local/src
RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends build-essential ca-certificates curl
rm -rf /var/lib/apt/lists/*
curl -sL https://github.com/ncopa/su-exec/archive/refs/tags/v0.2.tar.gz | tar --strip-components=1 -zxvf -
make
EOF

# toolchain image
FROM sunodo/machine-emulator:$MACHINE_EMULATOR_VERSION
ARG MACHINE_EMULATOR_VERSION
ARG LINUX_VERSION
ARG LINUX_KERNEL_VERSION
ARG ROM_VERSION

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
COPY --from=genext2fs /usr/local/bin/genext2fs /usr/bin/
COPY --from=su-exec /usr/local/src/su-exec /usr/local/bin/

ADD --chmod=644 \
    https://github.com/cartesi/image-kernel/releases/download/v$LINUX_VERSION/linux-$LINUX_KERNEL_VERSION.bin \
    /opt/cartesi/share/images/linux.bin
ADD --chmod=644 \
    https://github.com/cartesi/machine-emulator-rom/releases/download/v$ROM_VERSION/rom-v$ROM_VERSION.bin \
    /opt/cartesi/share/images/rom.bin

WORKDIR /mnt
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
