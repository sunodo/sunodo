ARG IMAGE_REGISTRY
ARG IMAGE_NAMESPACE
ARG IMAGE_NAME
ARG IMAGE_TAG
ARG TARGETARCH

# base-image
FROM ${IMAGE_REGISTRY}/${IMAGE_NAMESPACE}/${IMAGE_NAME}:$IMAGE_TAG AS base-image
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates

# Build the chiselled filesystem based on the desired slices.
#FIXME: replace the image with the official one when it's available
#       from: docker.io/risv64/ubuntu to: docker.io/library/ubuntu
FROM base-image AS chisel
ARG TARGETARCH

WORKDIR /rootfs

# Extracte machine-emulator-tools into the chiselled filesystem
ARG MACHINE_EMULATOR_TOOLS_VERSION
ADD https://github.com/cartesi/machine-emulator-tools/releases/download/v${MACHINE_EMULATOR_TOOLS_VERSION}/machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb /
RUN dpkg -x /machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb /rootfs

# Get chisel binary
ARG CHISEL_VERSION
ADD "https://github.com/canonical/chisel/releases/download/v${CHISEL_VERSION}/chisel_v${CHISEL_VERSION}_linux_${TARGETARCH}.tar.gz" chisel.tar.gz
RUN tar -xvf chisel.tar.gz -C /usr/bin/

# Extract crun dependencies into the chiselled filesystem
# FIXME: remove this when crun's dependecies slices are upstream
#ADD https://github.com/endersonmaia/chisel-releases.git#crun-to-22.04-with-busybox-static /chisel-22.04
ADD https://github.com/endersonmaia/chisel-releases.git#8f144cb28168f48f5931702157eb71375ac98bd5 /chisel-22.04
RUN chisel cut \
    --release /chisel-22.04 \
    --root /rootfs \
    --arch=${TARGETARCH} \
    base-files_base \
    base-files_release-info \
    base-passwd_data \
    libc6_libs \
    libcap2_libs \
    libgcc-s1_libs \
    libseccomp2_libs \
    libyajl2_libs \
    busybox-static_bins

RUN <<EOF
set -e
ln -s /bin/busybox bin/sh
mkdir -p proc sys dev run cruntime mnt
echo "dapp:x:1000:1000::/home/dapp:/bin/sh" >> etc/passwd
echo "dapp:x:1000:" >> etc/group
mkdir home/dapp
chown 1000:1000 home/dapp
ln -s /mnt/app cruntime/rootfs
EOF

# patch cartesi-init to use crun
COPY cartesi-init usr/sbin/cartesi-init
#XXX: how to inject the .process.args into the crun config.json ?
COPY config.json cruntime/config.json

FROM base-image AS crun-builder
ARG DEBIAN_FRONTEND=noninteractive
RUN <<EOF
set -e
apt-get install -y \
    autoconf \
    automake \
    build-essential \
    gcc \
    git \
    go-md2man \
    libcap-dev \
    libprotobuf-c-dev \
    libseccomp-dev \
    libtool \
    libyajl-dev \
    make \
    pkgconf \
    python3
EOF

WORKDIR /usr/local/src
#XXX: make crun static ?
# crun:v1.4.4 -> a220ca661ce078f2c37b38c92e66cf66c012d9c1
ADD --keep-git-dir https://github.com/containers/crun.git#a220ca661ce078f2c37b38c92e66cf66c012d9c1 /usr/local/src
RUN <<EOF
set -e
./autogen.sh
./configure \
    --disable-systemd \
    --disable-criu
make
EOF

# Make the chiselled filesystem the only thing
# present in the final image.
FROM scratch
COPY --from=chisel /rootfs /
COPY --from=crun-builder /usr/local/src/crun /usr/bin/
WORKDIR /cruntime
ENV ROLLUP_HTTP_SERVER_URL="http://127.0.0.1:5004"
ENTRYPOINT ["rollup-init"]
CMD ["crun", "run", "app"]
