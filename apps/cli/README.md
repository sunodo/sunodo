# Sunodo CLI

Sunodo provides a CLI to help developers to:

-   `create` applications from templates
-   `build` applications from source to a cartesi machine
-   `run` applications in a local development environment
-   `test` applications running inside a cartesi machine
-   `deploy` applications to a cloud provider
-   `monitor` application already running on a cloud provider

It's implemented using the [oclif framework](https://oclif.io) and distributed through several channels including `npm` and `homebrew`.

<!-- toc -->
* [Sunodo CLI](#sunodo-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @sunodo/cli
$ sunodo COMMAND
running command...
$ sunodo (--version)
@sunodo/cli/0.6.0 linux-x64 node-v20.3.0
$ sunodo --help [COMMAND]
USAGE
  $ sunodo COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`sunodo address-book`](#sunodo-address-book)
* [`sunodo build`](#sunodo-build)
* [`sunodo clean`](#sunodo-clean)
* [`sunodo create NAME`](#sunodo-create-name)
* [`sunodo doctor`](#sunodo-doctor)
* [`sunodo help [COMMANDS]`](#sunodo-help-commands)
* [`sunodo run`](#sunodo-run)
* [`sunodo send`](#sunodo-send)
* [`sunodo send dapp-address`](#sunodo-send-dapp-address)
* [`sunodo send erc20`](#sunodo-send-erc20)
* [`sunodo send erc721`](#sunodo-send-erc721)
* [`sunodo send ether`](#sunodo-send-ether)
* [`sunodo send generic`](#sunodo-send-generic)
* [`sunodo shell [IMAGE]`](#sunodo-shell-image)
* [`sunodo update [CHANNEL]`](#sunodo-update-channel)

## `sunodo address-book`

Prints addresses of smart contracts deployed.

```
USAGE
  $ sunodo address-book [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Prints addresses of smart contracts deployed.

  Prints the addresses of all smart contracts deployed to the runtime environment of the application.

EXAMPLES
  $ sunodo address-book
```

_See code: [dist/commands/address-book.ts](https://github.com/sunodo/sunodo/blob/v0.6.0/dist/commands/address-book.ts)_

## `sunodo build`

Build application.

```
USAGE
  $ sunodo build [--network <value>] [--from-image <value>] [--target <value>]

FLAGS
  --from-image=<value>  skip docker build and start from this image.
  --network=<value>     [default: localhost] target network name of application.
  --target=<value>      target of docker multi-stage build.

DESCRIPTION
  Build application.

  Build application starting from a Dockerfile and ending with a snapshot of the corresponding Cartesi Machine already
  booted and yielded for the first time. This snapshot can be used to start a Cartesi node for the application using
  `sunodo run`. The process can also start from a Docker image built by the developer using `docker build` using the
  option `--from-image`

EXAMPLES
  $ sunodo build

  $ sunodo build --from-image my-app

FLAG DESCRIPTIONS
  --from-image=<value>  skip docker build and start from this image.

    if the build process of the application Dockerfile needs more control the developer can build the image using the
    `docker build` command, and then start the build process of the Cartesi machine starting from that image.

  --network=<value>  target network name of application.

    the specified network name is injected as build-arg of the application Dockerfile. It's up to the developer to use
    that depending on the application needs.

  --target=<value>  target of docker multi-stage build.

    if the application Dockerfile uses a multi-stage strategy, and stage of the image to be exported as a Cartesi
    machine is not the last stage, use this parameter to specify the target stage.
```

_See code: [dist/commands/build.ts](https://github.com/sunodo/sunodo/blob/v0.6.0/dist/commands/build.ts)_

## `sunodo clean`

Clean build artifacts of application.

```
USAGE
  $ sunodo clean

DESCRIPTION
  Clean build artifacts of application.

  Deletes all cached build artifacts of application.

EXAMPLES
  $ sunodo clean
```

_See code: [dist/commands/clean.ts](https://github.com/sunodo/sunodo/blob/v0.6.0/dist/commands/clean.ts)_

## `sunodo create NAME`

Create application

```
USAGE
  $ sunodo create NAME --template cpp|cpp-low-level|go|javascript|lua|python|ruby [--branch <value>]

ARGUMENTS
  NAME  application and directory name

FLAGS
  --branch=<value>     [default: main] branch name to use if not main
  --template=<option>  (required) template name to use
                       <options: cpp|cpp-low-level|go|javascript|lua|python|ruby>

DESCRIPTION
  Create application

EXAMPLES
  $ sunodo create
```

_See code: [dist/commands/create.ts](https://github.com/sunodo/sunodo/blob/v0.6.0/dist/commands/create.ts)_

## `sunodo doctor`

Verify the minimal requirements for the sunodo execution commands

```
USAGE
  $ sunodo doctor

DESCRIPTION
  Verify the minimal requirements for the sunodo execution commands

EXAMPLES
  $ sunodo doctor
```

_See code: [dist/commands/doctor.ts](https://github.com/sunodo/sunodo/blob/v0.6.0/dist/commands/doctor.ts)_

## `sunodo help [COMMANDS]`

Display help for sunodo.

```
USAGE
  $ sunodo help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for sunodo.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.9/src/commands/help.ts)_

## `sunodo run`

Run application node.

```
USAGE
  $ sunodo run [--block-time <value>] [--epoch-duration <value>] [-v]

FLAGS
  -v, --verbose             verbose output
  --block-time=<value>      [default: 5] interval between blocks (in seconds)
  --epoch-duration=<value>  [default: 86400] duration of an epoch (in seconds)

DESCRIPTION
  Run application node.

  Run a local cartesi node for the application.

EXAMPLES
  $ sunodo run
```

_See code: [dist/commands/run.ts](https://github.com/sunodo/sunodo/blob/v0.6.0/dist/commands/run.ts)_

## `sunodo send`

Send input to the application.

```
USAGE
  $ sunodo send

DESCRIPTION
  Send input to the application.

  Sends different kinds of input to the application in interactive mode.

EXAMPLES
  $ sunodo send
```

_See code: [dist/commands/send/index.ts](https://github.com/sunodo/sunodo/blob/v0.6.0/dist/commands/send/index.ts)_

## `sunodo send dapp-address`

Send DApp address input to the application.

```
USAGE
  $ sunodo send dapp-address [--dapp <value>] [-c <value>] [-r <value>] [--mnemonic-passphrase <value>]
    [--mnemonic-index <value>]

FLAGS
  --dapp=<value>  dapp address.

ETHEREUM FLAGS
  -c, --chain=<value>    The chain name or EIP-155 chain ID.
  -r, --rpc-url=<value>  The RPC endpoint.

WALLET FLAGS
  --mnemonic-index=<value>       Use the private key from the given mnemonic index.
  --mnemonic-passphrase=<value>  Use a BIP39 passphrase for the mnemonic.

DESCRIPTION
  Send DApp address input to the application.

  Sends an input to the application with its own address.

EXAMPLES
  $ sunodo send dapp-address

FLAG DESCRIPTIONS
  --dapp=<value>  dapp address.

    the address of the DApp, defaults to the deployed DApp address if application is running.
```

## `sunodo send erc20`

Send ERC-20 deposit to the application.

```
USAGE
  $ sunodo send erc20 [--dapp <value>] [-c <value>] [-r <value>] [--mnemonic-passphrase <value>]
    [--mnemonic-index <value>] [--token <value>] [--amount <value>]

FLAGS
  --amount=<value>  [default: 1] amount
  --dapp=<value>    dapp address.
  --token=<value>   token address

ETHEREUM FLAGS
  -c, --chain=<value>    The chain name or EIP-155 chain ID.
  -r, --rpc-url=<value>  The RPC endpoint.

WALLET FLAGS
  --mnemonic-index=<value>       Use the private key from the given mnemonic index.
  --mnemonic-passphrase=<value>  Use a BIP39 passphrase for the mnemonic.

DESCRIPTION
  Send ERC-20 deposit to the application.

  Sends ERC-20 deposits to the application, optionally in interactive mode.

EXAMPLES
  $ sunodo send erc20

FLAG DESCRIPTIONS
  --dapp=<value>  dapp address.

    the address of the DApp, defaults to the deployed DApp address if application is running.
```

## `sunodo send erc721`

Send ERC-721 deposit to the application.

```
USAGE
  $ sunodo send erc721 [--dapp <value>] [-c <value>] [-r <value>] [--mnemonic-passphrase <value>]
    [--mnemonic-index <value>] [--token <value>] [--tokenId <value>]

FLAGS
  --dapp=<value>     dapp address.
  --token=<value>    token address
  --tokenId=<value>  token ID

ETHEREUM FLAGS
  -c, --chain=<value>    The chain name or EIP-155 chain ID.
  -r, --rpc-url=<value>  The RPC endpoint.

WALLET FLAGS
  --mnemonic-index=<value>       Use the private key from the given mnemonic index.
  --mnemonic-passphrase=<value>  Use a BIP39 passphrase for the mnemonic.

DESCRIPTION
  Send ERC-721 deposit to the application.

  Sends ERC-721 deposits to the application, optionally in interactive mode.

EXAMPLES
  $ sunodo send erc721

FLAG DESCRIPTIONS
  --dapp=<value>  dapp address.

    the address of the DApp, defaults to the deployed DApp address if application is running.
```

## `sunodo send ether`

Send ether deposit to the application.

```
USAGE
  $ sunodo send ether [--dapp <value>] [-c <value>] [-r <value>] [--mnemonic-passphrase <value>]
    [--mnemonic-index <value>] [--amount <value>] [--execLayerData <value>]

FLAGS
  --amount=<value>         amount, in ETH units
  --dapp=<value>           dapp address.
  --execLayerData=<value>  [default: 0x] exec layer data

ETHEREUM FLAGS
  -c, --chain=<value>    The chain name or EIP-155 chain ID.
  -r, --rpc-url=<value>  The RPC endpoint.

WALLET FLAGS
  --mnemonic-index=<value>       Use the private key from the given mnemonic index.
  --mnemonic-passphrase=<value>  Use a BIP39 passphrase for the mnemonic.

DESCRIPTION
  Send ether deposit to the application.

  Sends ether deposits to the application, optionally in interactive mode.

EXAMPLES
  $ sunodo send ether

FLAG DESCRIPTIONS
  --dapp=<value>  dapp address.

    the address of the DApp, defaults to the deployed DApp address if application is running.
```

## `sunodo send generic`

Send generic input to the application.

```
USAGE
  $ sunodo send generic [--dapp <value>] [-c <value>] [-r <value>] [--mnemonic-passphrase <value>]
    [--mnemonic-index <value>] [--input <value>] [--input-encoding hex|string|abi] [--input-abi-params <value>]

FLAGS
  --dapp=<value>              dapp address.
  --input=<value>             see input-encoding for definition on how input is parsed
  --input-abi-params=<value>  ABI params definition for input, following human-readable format specified at
                              https://abitype.dev/api/human.html#parseabiparameters
  --input-encoding=<option>   if input-encoding is undefined, the input is parsed as a hex-string if it starts with 0x
                              or else is parsed as a UTF-8 encoding
                              <options: hex|string|abi>

ETHEREUM FLAGS
  -c, --chain=<value>    The chain name or EIP-155 chain ID.
  -r, --rpc-url=<value>  The RPC endpoint.

WALLET FLAGS
  --mnemonic-index=<value>       Use the private key from the given mnemonic index.
  --mnemonic-passphrase=<value>  Use a BIP39 passphrase for the mnemonic.

DESCRIPTION
  Send generic input to the application.

  Sends generics inputs to the application, optionally in interactive mode.

EXAMPLES
  $ sunodo send generic

FLAG DESCRIPTIONS
  --dapp=<value>  dapp address.

    the address of the DApp, defaults to the deployed DApp address if application is running.

  --input=<value>  see input-encoding for definition on how input is parsed

    input payload

  --input-abi-params=<value>

    ABI params definition for input, following human-readable format specified at
    https://abitype.dev/api/human.html#parseabiparameters

    input abi params

  --input-encoding=hex|string|abi

    if input-encoding is undefined, the input is parsed as a hex-string if it starts with 0x or else is parsed as a
    UTF-8 encoding

    input encoding
```

## `sunodo shell [IMAGE]`

Start a shell in cartesi machine of application

```
USAGE
  $ sunodo shell [IMAGE] [--run-as-root]

ARGUMENTS
  IMAGE  image ID|name

FLAGS
  --run-as-root  run as root user

DESCRIPTION
  Start a shell in cartesi machine of application

EXAMPLES
  $ sunodo shell
```

_See code: [dist/commands/shell.ts](https://github.com/sunodo/sunodo/blob/v0.6.0/dist/commands/shell.ts)_

## `sunodo update [CHANNEL]`

update the sunodo CLI

```
USAGE
  $ sunodo update [CHANNEL] [-a] [-v <value> | -i] [--force]

FLAGS
  -a, --available        Install a specific version.
  -i, --interactive      Interactively select version to install. This is ignored if a channel is provided.
  -v, --version=<value>  Install a specific version.
  --force                Force a re-download of the requested version.

DESCRIPTION
  update the sunodo CLI

EXAMPLES
  Update to the stable channel:

    $ sunodo update stable

  Update to a specific version:

    $ sunodo update --version 1.0.0

  Interactively select version:

    $ sunodo update --interactive

  See available versions:

    $ sunodo update --available
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v3.1.18/src/commands/update.ts)_
<!-- commandsstop -->
