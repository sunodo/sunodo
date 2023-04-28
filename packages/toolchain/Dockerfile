# syntax=docker.io/docker/dockerfile:1.4
ARG BASE_IMAGE
ARG MACHINE_EMULATOR_VERSION
ARG LINUX_VERSION
ARG LINUX_KERNEL_VERSION
ARG ROM_VERSION

FROM ${BASE_IMAGE} as builder

WORKDIR /usr/local/src
RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends autoconf automake build-essential ca-certificates curl libarchive-dev libtool
rm -rf /var/lib/apt/lists/*
EOF

FROM builder as genext2fs

WORKDIR /usr/local/src
RUN <<EOF
curl -sL https://github.com/cartesi/genext2fs/archive/refs/heads/cartesi.tar.gz | tar --strip-components=1 -zxvf -
./autogen.sh
./configure --enable-libarchive
make
make install
EOF

FROM builder as su-exec

# v0.2 -> f85e5bde1afef399021fbc2a99c837cf851ceafa
WORKDIR /usr/local/src
RUN <<EOF
curl -sL https://github.com/ncopa/su-exec/archive/f85e5bde1afef399021fbc2a99c837cf851ceafa.tar.gz | tar --strip-components=1 -zxvf -
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
    linux-$LINUX_KERNEL_VERSION.bin \
    /opt/cartesi/share/images/linux.bin
ADD --chmod=644 \
    rom-v$ROM_VERSION.bin \
    /opt/cartesi/share/images/rom.bin

WORKDIR /mnt
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
