# Machine emulator tools packaging

The [machine-emulator-tools](https://github.com/cartesi/machine-emulator-tools) is a set of tools that need to be installed in the root filesystem of a Cartesi DApp.

It is currently distributed in binary format compiled for the `linux/riscv64` architecture and available as a `.tar.gz` file in the [GitHub releases](https://github.com/cartesi/machine-emulator-tools/releases).

However the most convenient way to add this to the user application, which uses Docker as a build system, was to add a `COPY --from` directive, like the one below:

```dockerfile
COPY --from=cartesi/machine-emulator-tools:0.11.0 / /
```

While `cartesi` doesn't provide such image, Sunodo will provide the image under the `ghcr.io/sunodo` organization.

So the application should include the following:

```dockerfile
COPY --from=sunodo/machine-emulator-tools:0.11.0-ubuntu22.04 / /
```

Only `ubuntu 22.04` is currently supported. We might add other distributions in the future.

## Building the image

To build and publish the images to the registry, you need to have the `docker` CLI installed and logged in to both `ghcr.io/sunodo` and `docker.io` registries.

Then you can run the following command:

```bash
docker buildx bake --push --provenance=false
```

The `--provenance=false` is needed because of an [issue](https://github.com/docker/buildx/issues/1509#issuecomment-1378454396) with GHCR not handling well new docker images produced with provenance by default by BuildKit 0.11+.
