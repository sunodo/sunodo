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

# sdk image
FROM cartesi/machine-emulator:$MACHINE_EMULATOR_VERSION
ARG MACHINE_EMULATOR_VERSION
ARG LINUX_VERSION
ARG LINUX_KERNEL_VERSION
ARG ROM_VERSION

RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends curl libarchive-tools locales xz-utils
rm -rf /var/lib/apt/lists/*

sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen
locale-gen
update-locale LANG=en_US.UTF-8
EOF

ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en

COPY entrypoint.sh /usr/local/bin/
COPY retar /usr/local/bin/
COPY --from=genext2fs /usr/local/bin/genext2fs /usr/bin/
COPY --from=su-exec /usr/local/src/su-exec /usr/local/bin/

ADD --chmod=644 \
    https://github.com/cartesi/image-kernel/releases/download/v$LINUX_VERSION/linux-$LINUX_KERNEL_VERSION.bin \
    /opt/cartesi/share/images/linux.bin
ADD --chmod=644 \
    https://github.com/cartesi/machine-emulator-rom/releases/download/v$ROM_VERSION/rom-v$ROM_VERSION.bin \
    /opt/cartesi/share/images/rom.bin
RUN curl -sSL https://github.com/cartesi/image-kernel/releases/download/v$LINUX_VERSION/linux-headers-$LINUX_KERNEL_VERSION.tar.xz | \
    tar -xJ -C /

WORKDIR /mnt
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
