# SDK

This produces a Docker image containing tools used during the build of a Sunodo application.

The image starts from the Cartesi emulator image, and adds the following:

-   linux kernel published by Cartesi
-   a custom [genext2fs](https://github.com/cartesi/genext2fs/tree/next) tool used to generate the root filesystem of the application.

The produced image is published to both [DockerHub](https://hub.docker.com/repository/docker/sunodo/sdk/general) and [GitHub](https://github.com/orgs/sunodo/packages/container/package/sdk), for better availability.

The tag of the image follows the version of the [Cartesi Machine SDK](https://github.com/cartesi/machine-emulator-sdk/tags).

```shell
docker run sunodo/sdk:<version> genext2fs --help
docker run sunodo/sdk:<version> cartesi-machine --help
```

## Building the image

To build and publish the images to the registry, you need to have the `docker` CLI installed and logged in to both `ghcr.io/sunodo` and `docker.io` registries.

Then you can run the following command:

```bash
docker buildx bake --push --provenance=false
```

The `--provenance=false` is needed because of an issue with GHCR not handling well new docker images produced with provenance by default by BuildKit 0.11+.
