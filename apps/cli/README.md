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
* [`sunodo apps create [NAME]`](#sunodo-apps-create-name)
* [`sunodo apps delete NAME`](#sunodo-apps-delete-name)
* [`sunodo apps list`](#sunodo-apps-list)
* [`sunodo auth login`](#sunodo-auth-login)
* [`sunodo auth logout`](#sunodo-auth-logout)
* [`sunodo auth token`](#sunodo-auth-token)
* [`sunodo help [COMMANDS]`](#sunodo-help-commands)
* [`sunodo login`](#sunodo-login)
* [`sunodo logout`](#sunodo-logout)
* [`sunodo orgs create NAME`](#sunodo-orgs-create-name)
* [`sunodo orgs delete NAME`](#sunodo-orgs-delete-name)
* [`sunodo orgs list`](#sunodo-orgs-list)
* [`sunodo platform chains`](#sunodo-platform-chains)
* [`sunodo platform regions`](#sunodo-platform-regions)
* [`sunodo platform runtimes`](#sunodo-platform-runtimes)
* [`sunodo token`](#sunodo-token)
* [`sunodo update [CHANNEL]`](#sunodo-update-channel)

## `sunodo apps create [NAME]`

Create application

```
USAGE
  $ sunodo apps create [NAME] [--org <value>]

FLAGS
  --org=<value>  organization slug of the application

DESCRIPTION
  Create application

EXAMPLES
  $ sunodo apps create
```

## `sunodo apps delete NAME`

Delete application

```
USAGE
  $ sunodo apps delete NAME

DESCRIPTION
  Delete application

EXAMPLES
  $ sunodo apps delete
```

## `sunodo apps list`

List applications

```
USAGE
  $ sunodo apps list [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ] [--org <value>]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --org=<value>      organization slug of the applications
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  List applications

EXAMPLES
  $ sunodo apps list
```

## `sunodo auth login`

Login or Signup to Sunodo

```
USAGE
  $ sunodo auth login

DESCRIPTION
  Login or Signup to Sunodo

ALIASES
  $ sunodo login

EXAMPLES
  $ sunodo auth login
```

## `sunodo auth logout`

clears local login credentials and invalidates API session

```
USAGE
  $ sunodo auth logout

DESCRIPTION
  clears local login credentials and invalidates API session

ALIASES
  $ sunodo logout

EXAMPLES
  $ sunodo auth logout
```

## `sunodo auth token`

Prints current saved token (if authenticated)

```
USAGE
  $ sunodo auth token

DESCRIPTION
  Prints current saved token (if authenticated)

ALIASES
  $ sunodo token

EXAMPLES
  $ sunodo auth token
```

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

## `sunodo login`

Login or Signup to Sunodo

```
USAGE
  $ sunodo login

DESCRIPTION
  Login or Signup to Sunodo

ALIASES
  $ sunodo login

EXAMPLES
  $ sunodo login
```

## `sunodo logout`

clears local login credentials and invalidates API session

```
USAGE
  $ sunodo logout

DESCRIPTION
  clears local login credentials and invalidates API session

ALIASES
  $ sunodo logout

EXAMPLES
  $ sunodo logout
```

## `sunodo orgs create NAME`

Create organization

```
USAGE
  $ sunodo orgs create NAME --slug <value>

FLAGS
  --slug=<value>  (required) slug of the organization

DESCRIPTION
  Create organization

EXAMPLES
  $ sunodo orgs create
```

## `sunodo orgs delete NAME`

Delete organization

```
USAGE
  $ sunodo orgs delete NAME

DESCRIPTION
  Delete organization

EXAMPLES
  $ sunodo orgs delete
```

## `sunodo orgs list`

List organizations

```
USAGE
  $ sunodo orgs list [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  List organizations

EXAMPLES
  $ sunodo orgs list
```

## `sunodo platform chains`

list chains supported by the platform

```
USAGE
  $ sunodo platform chains [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ] [--live <value>]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --live=<value>     include only live production chains
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  list chains supported by the platform

EXAMPLES
  $ sunodo platform chains
```

## `sunodo platform regions`

list regions supported by the platform

```
USAGE
  $ sunodo platform regions [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ] [--live <value>]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --live=<value>     include only live production chains
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  list regions supported by the platform

EXAMPLES
  $ sunodo platform regions
```

## `sunodo platform runtimes`

list runtimes supported by the platform

```
USAGE
  $ sunodo platform runtimes [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ] [--live <value>]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --live=<value>     include only live production chains
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  list runtimes supported by the platform

EXAMPLES
  $ sunodo platform runtimes
```

## `sunodo token`

Prints current saved token (if authenticated)

```
USAGE
  $ sunodo token

DESCRIPTION
  Prints current saved token (if authenticated)

ALIASES
  $ sunodo token

EXAMPLES
  $ sunodo token
```

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

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v3.1.9/src/commands/update.ts)_
<!-- commandsstop -->
