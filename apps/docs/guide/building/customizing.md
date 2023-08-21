# Customizing the build

The build process of a Cartesi application is guided by a `Dockerfile` which is part of the application code, and can be customized as any `Dockerfile`, as long as the final stage of a multi-stage build produces a `linux/riscv64` docker image.

The default multi-stage build `target` is the last one, but can be customized with the `--target` option of the `sunodo build` command.

The `sunodo build` command calls `docker buildx build` under the hood, and there are many docker options that are not exposed by the sunodo CLI. In case the user needs advanced docker options he can build the `linux/riscv64` Docker image himself, and call `sunodo build` with the `--from-image` option to specify the name or sha of the image he built manually.

## Memory

The Cartesi machine created by Sunodo uses 128Mb of RAM by default. This can be customized by setting the `io.cartesi.rollups.ram_size` Docker label in the final image, like the one below:

```dockerfile
LABEL io.cartesi.rollups.ram_size=128Mi
```
