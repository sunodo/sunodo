# Sunodo CLI

Sunodo provides a CLI to help developers to:

-   `create` applications from templates
-   `build` applications from source to a cartesi machine
-   `run` applications in a local development environment
-   `test` aplications running inside a cartesi machine
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
@sunodo/cli/0.3.1 darwin-arm64 node-v20.0.0
$ sunodo --help [COMMAND]
USAGE
  $ sunodo COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`sunodo build`](#sunodo-build)
* [`sunodo clean`](#sunodo-clean)
* [`sunodo create NAME`](#sunodo-create-name)
* [`sunodo help [COMMANDS]`](#sunodo-help-commands)
* [`sunodo shell [IMAGE]`](#sunodo-shell-image)
* [`sunodo update [CHANNEL]`](#sunodo-update-channel)

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

_See code: [dist/commands/build.ts](https://github.com/sunodo/sunodo/blob/v0.3.1/dist/commands/build.ts)_

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

_See code: [dist/commands/clean.ts](https://github.com/sunodo/sunodo/blob/v0.3.1/dist/commands/clean.ts)_

## `sunodo create NAME`

Create application

```
USAGE
  $ sunodo create NAME --template javascript|python [--branch <value>]

ARGUMENTS
  NAME  application and directory name

FLAGS
  --branch=<value>     [default: main] branch name to use if not main
  --template=<option>  (required) template name to use
                       <options: javascript|python>

DESCRIPTION
  Create application

EXAMPLES
  $ sunodo create
```

_See code: [dist/commands/create.ts](https://github.com/sunodo/sunodo/blob/v0.3.1/dist/commands/create.ts)_

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

_See code: [dist/commands/shell.ts](https://github.com/sunodo/sunodo/blob/v0.3.1/dist/commands/shell.ts)_

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

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v3.1.13/src/commands/update.ts)_
<!-- commandsstop -->
