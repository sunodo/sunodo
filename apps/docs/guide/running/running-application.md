# Running application

:::warning
The Sunodo CLI is deprecated in favor of the new Cartesi CLI tool. Please refer to the [Cartesi documentation](https://docs.cartesi.io) for the most up-to-date information. If you have a Sunodo application and need to migrate to a Cartesi CLI application refer to the [migration guide](/guide/introduction/migrating).
:::

The `cartesi run` command will execute a Cartesi node for the application previously built with `cartesi build`.

## Verbosity

By default the node works on non-verbose mode, and only outputs logs coming from the user backend application. In case the user needs more information there is the `--verbose` command option.

## Blockchain configuration

Cartesi CLI runs a local private chain powered by [anvil](https://github.com/foundry-rs/foundry/tree/master/crates/anvil) at port `8545`. All contracts of the Cartesi Rollups framework are already deployed, and their addresses can be inspected using `cartesi address-book`.

The private chain by default has a block time of 5 seconds, controlled by `--block-time <seconds>`, and runs on auto-mine mode.

## Epoch

By default the node closes an epoch once a day, but this can be controlled by the `--epoch-duration <seconds>` command option. It's an important setting when it comes down to voucher execution.

## Rollups Node configuration

You can create a `.cartesi.env` file in the root of your project to configure the node.

All Rollups Node services can be configured using environment variables.

For ex., in case you want to change the default deadline for advancing the state for the rollups-advance-runner service.

```shell
cat .cartesi.env
SM_DEADLINE_ADVANCE_STATE=360000
```

Check the configuration options for each service in the [Rollups Node documentation](https://github.com/cartesi/rollups/blob/v1.0.1/offchain/README.md).

## No-backend mode

Cartesi `run` also supports running a node without the user application backend packaged as a Cartesi machine. In this case the user application can be executed on the host, without the concern of being compiled to RISC-V.

This is a useful development workflow help, but there are some caveats the user must be aware:

1. The application will eventually need to be compiled to RISC-V, or use a RISC-V runtime in case of interpreted languages;
2. In this mode the application will not be running inside the sandbox of the Cartesi machine, and will not block operations that won't be allowed when running inside a Cartesi machine, like accessing remote resources;
3. This mode only works for applications that use the Cartesi Rollups HTTP API, and doesn't work with applications using the low-level API;
4. Performance inside a Cartesi machine will be much lower than running on the host.

When launching a node with the `--no-backend` the user must then start his application on the host and fetch inputs from the endpoint running at `http://127.0.0.1:8080/host-runner`.
