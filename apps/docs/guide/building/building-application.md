# Building application

To build an existing application simply use the command below:

```shell
sunodo build
```

The build process use [Docker](https://www.docker.com/), so you need to have it installed and running, as described in the [system requirements](../introduction/installing#system-requirements) section.

Building consists of the following intermediate steps:

1. building the application code to the RISC-V architecture
2. assembling a Cartesi Machine using a Linux distribution
3. booting the machine with the application entrypoint until it yields successfully for the first time.

The end result of this process is a _Cartesi machine snapshot_, which is a Cartesi machine image ready to receive inputs.
