# Installing

The `sunodo` CLI tool can be installed on macOS and Linux, and on Windows using [WSL](https://learn.microsoft.com/en-us/windows/wsl/install).

## System requirements

The CLI heavily uses [Docker](https://docker.com) under the hood, so you must have it installed and up-to-date, along with the following plugins:

-   [Docker Buildx](https://docs.docker.com/buildx/working-with-buildx/)
-   [Docker Compose](https://docs.docker.com/compose/)

The highly recommended way to have all of these installed is to install [Docker Desktop](https://www.docker.com/products/docker-desktop/).

## macOS

MacOS [Homebrew](https://brew.sh) users can install sunodo with:

```shell
brew install sunodo/tap/sunodo
```

Users who don't use [Homebrew](https://brew.sh) should install [Node.js](https://nodejs.org/) and then install `sunodo` with:

```shell
npm install -g @sunodo/cli
```

## Linux

Linux users can either also use [Homebrew on Linux](https://docs.brew.sh/Homebrew-on-Linux), or install [Node.js](https://nodejs.org/) and then install `sunodo` with:

```shell
npm install -g @sunodo/cli
```

::: info
Debian `apt-get` packages will be available soon.
:::

## Windows

Windows users are recommended to use [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install) and follow the Linux instructions above.
