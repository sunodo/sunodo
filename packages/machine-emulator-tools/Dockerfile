# download machine-emulator tools and create a scratch image the tar.gz contents at root
FROM busybox as download
ARG VERSION
ADD https://github.com/cartesi/machine-emulator-tools/releases/download/v${VERSION}/machine-emulator-tools-v${VERSION}.tar.gz \
    /tmp/machine-emulator-tools.tar.gz
RUN mkdir -p /tmp/machine-emulator-tools && tar -C /tmp/machine-emulator-tools -xzf /tmp/machine-emulator-tools.tar.gz

FROM scratch as tools
COPY --from=download /tmp/machine-emulator-tools/ /
