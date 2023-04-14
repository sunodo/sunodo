# Sunodo CLI

Sunodo provides a CLI to interact with the platform through its [REST API](../api/).

It's implemented using the [oclif framework](https://oclif.io) and distributed through several channels including `npm` and `homebrew`. An API TypeScript client is generated from the OpenAPI especification using the [openapi-typescript
Public](https://github.com/drwpow/openapi-typescript) library.

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
@sunodo/cli/0.1.0 darwin-arm64 node-v19.6.0
$ sunodo --help [COMMAND]
USAGE
  $ sunodo COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`sunodo create NAME`](#sunodo-create-name)
* [`sunodo help [COMMANDS]`](#sunodo-help-commands)
* [`sunodo update [CHANNEL]`](#sunodo-update-channel)

## `sunodo create NAME`

Create application

```
USAGE
  $ sunodo create NAME --template javascript [--branch <value>]

ARGUMENTS
  NAME  application and directory name

FLAGS
  --branch=<value>     [default: main] branch name to use if not main
  --template=<option>  (required) template name to use
                       <options: javascript>

DESCRIPTION
  Create application

EXAMPLES
  $ sunodo create
```

_See code: [dist/commands/create.ts](https://github.com/sunodo/sunodo/blob/v0.1.0/dist/commands/create.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.8/src/commands/help.ts)_

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

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v3.1.8/src/commands/update.ts)_
<!-- commandsstop -->
