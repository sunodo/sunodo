# Building application

To build an existing application simply use the command below:

```shell
sunodo build
```

The build process use [Docker](https://www.docker.com/), so you need to have it installed and running, as described in the [system requirements](../introduction/installing#system-requirements) section.

Building consists of the following intermediate steps:

-   building the application code to the RISC-V architecture
-   assembling a Cartesi Machine using a Linux distribution
-   booting the machine with the application entrypoint until it yields successfully for the first time.

The end result of this process is a "cartesi machine snapshot".
