# Building application

:::warning
The Sunodo CLI is deprecated in favor of the new Cartesi CLI tool. Please refer to the [Cartesi documentation](https://docs.cartesi.io) for the most up-to-date information. If you have a Sunodo application and need to migrate to a Cartesi CLI application refer to the [migration guide](/guide/introduction/migrating).
:::

To build an existing application simply use the command below:

```shell
cartesi build
```

The build process uses [Docker](https://www.docker.com/), so you need to have it installed and running, as described in the [system requirements](../introduction/installing#system-requirements) section.

Building consists of the following intermediate steps:

1. building the application code to the RISC-V architecture
2. assembling a Cartesi Machine using a Linux distribution
3. booting the machine with the application entrypoint until it yields successfully for the first time.

The end result of this process is a _Cartesi machine snapshot_, which is a Cartesi machine image ready to receive inputs.
