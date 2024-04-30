# Installing

:::warning
The Sunodo CLI is deprecated in favor of the new Cartesi CLI tool. Please refer to the [Cartesi documentation](https://docs.cartesi.io) for the most up-to-date information. If you have a Sunodo application and need to migrate to a Cartesi CLI application refer to the [migration guide](/guide/introduction/migrating).
:::

The `cartesi` CLI tool can be installed on macOS and Linux, and on Windows using [WSL](https://learn.microsoft.com/en-us/windows/wsl/install).

## System requirements

The CLI heavily uses [Docker](https://docker.com) under the hood, so you must have it installed and up-to-date, along with the following plugins:

-   [Docker Buildx](https://docs.docker.com/buildx/working-with-buildx/)
-   [Docker Compose](https://docs.docker.com/compose/)

The highly recommended way to have all of these installed is to install [Docker Desktop](https://www.docker.com/products/docker-desktop/).

If not using Docker Desktop, Docker RISC-V support can be installed by running the following command:

```shell
docker run --privileged --rm tonistiigi/binfmt:riscv
```

## macOS

MacOS [Homebrew](https://brew.sh) users can install sunodo with:

```shell
brew install cartesi/tap/cartesi
```

Users who don't use [Homebrew](https://brew.sh) should install [Node.js](https://nodejs.org/) and then install `cartesi` with:

```shell
npm install -g @cartesi/cli
```

## Linux

Linux users can either also use [Homebrew on Linux](https://docs.brew.sh/Homebrew-on-Linux), or install [Node.js](https://nodejs.org/) and then install `cartesi` with:

```shell
npm install -g @cartesi/cli
```

::: info
Debian `apt-get` packages will be available soon.
:::

## Windows

Windows users are recommended to use [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install) and follow the Linux instructions above.
