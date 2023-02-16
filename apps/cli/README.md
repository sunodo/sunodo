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
$ sunodoctl COMMAND
running command...
$ sunodoctl (--version)
@sunodo/cli/0.0.0 darwin-arm64 node-v19.6.0
$ sunodoctl --help [COMMAND]
USAGE
  $ sunodoctl COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`sunodoctl apps create [NAME]`](#sunodoctl-apps-create-name)
* [`sunodoctl apps delete NAME`](#sunodoctl-apps-delete-name)
* [`sunodoctl apps list`](#sunodoctl-apps-list)
* [`sunodoctl auth login`](#sunodoctl-auth-login)
* [`sunodoctl auth logout`](#sunodoctl-auth-logout)
* [`sunodoctl help [COMMANDS]`](#sunodoctl-help-commands)
* [`sunodoctl login`](#sunodoctl-login)
* [`sunodoctl logout`](#sunodoctl-logout)
* [`sunodoctl orgs create NAME`](#sunodoctl-orgs-create-name)
* [`sunodoctl orgs delete NAME`](#sunodoctl-orgs-delete-name)
* [`sunodoctl orgs list`](#sunodoctl-orgs-list)
* [`sunodoctl platform chains`](#sunodoctl-platform-chains)
* [`sunodoctl platform regions`](#sunodoctl-platform-regions)
* [`sunodoctl platform runtimes`](#sunodoctl-platform-runtimes)
* [`sunodoctl update [CHANNEL]`](#sunodoctl-update-channel)

## `sunodoctl apps create [NAME]`

Create application

```
USAGE
  $ sunodoctl apps create [NAME] [--org <value>]

FLAGS
  --org=<value>  organization slug of the application

DESCRIPTION
  Create application

EXAMPLES
  $ sunodoctl apps create
```

## `sunodoctl apps delete NAME`

Delete application

```
USAGE
  $ sunodoctl apps delete [NAME]

DESCRIPTION
  Delete application

EXAMPLES
  $ sunodoctl apps delete
```

## `sunodoctl apps list`

List applications

```
USAGE
  $ sunodoctl apps list [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml | 
    | [--csv | --no-truncate]] [--no-header | ] [--org <value>]

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
  $ sunodoctl apps list
```

## `sunodoctl auth login`

Login or Signup to Sunodo

```
USAGE
  $ sunodoctl auth login

DESCRIPTION
  Login or Signup to Sunodo

ALIASES
  $ sunodoctl login

EXAMPLES
  $ sunodoctl auth login
```

## `sunodoctl auth logout`

clears local login credentials and invalidates API session

```
USAGE
  $ sunodoctl auth logout

DESCRIPTION
  clears local login credentials and invalidates API session

ALIASES
  $ sunodoctl logout

EXAMPLES
  $ sunodoctl auth logout
```

## `sunodoctl help [COMMANDS]`

Display help for sunodoctl.

```
USAGE
  $ sunodoctl help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for sunodoctl.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.4/src/commands/help.ts)_

## `sunodoctl login`

Login or Signup to Sunodo

```
USAGE
  $ sunodoctl login

DESCRIPTION
  Login or Signup to Sunodo

ALIASES
  $ sunodoctl login

EXAMPLES
  $ sunodoctl login
```

## `sunodoctl logout`

clears local login credentials and invalidates API session

```
USAGE
  $ sunodoctl logout

DESCRIPTION
  clears local login credentials and invalidates API session

ALIASES
  $ sunodoctl logout

EXAMPLES
  $ sunodoctl logout
```

## `sunodoctl orgs create NAME`

Create organization

```
USAGE
  $ sunodoctl orgs create [NAME] --slug <value>

FLAGS
  --slug=<value>  (required) slug of the organization

DESCRIPTION
  Create organization

EXAMPLES
  $ sunodoctl orgs create
```

## `sunodoctl orgs delete NAME`

Delete organization

```
USAGE
  $ sunodoctl orgs delete [NAME]

DESCRIPTION
  Delete organization

EXAMPLES
  $ sunodoctl orgs delete
```

## `sunodoctl orgs list`

List organizations

```
USAGE
  $ sunodoctl orgs list [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml | 
    | [--csv | --no-truncate]] [--no-header | ]

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
  $ sunodoctl orgs list
```

## `sunodoctl platform chains`

list chains supported by the platform

```
USAGE
  $ sunodoctl platform chains [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml | 
    | [--csv | --no-truncate]] [--no-header | ] [--live <value>]

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
  $ sunodoctl platform chains
```

## `sunodoctl platform regions`

list regions supported by the platform

```
USAGE
  $ sunodoctl platform regions [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml | 
    | [--csv | --no-truncate]] [--no-header | ] [--live <value>]

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
  $ sunodoctl platform regions
```

## `sunodoctl platform runtimes`

list runtimes supported by the platform

```
USAGE
  $ sunodoctl platform runtimes [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml | 
    | [--csv | --no-truncate]] [--no-header | ] [--live <value>]

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
  $ sunodoctl platform runtimes
```

## `sunodoctl update [CHANNEL]`

update the sunodoctl CLI

```
USAGE
  $ sunodoctl update [CHANNEL] [-a] [-v <value> | -i] [--force]

FLAGS
  -a, --available        Install a specific version.
  -i, --interactive      Interactively select version to install. This is ignored if a channel is provided.
  -v, --version=<value>  Install a specific version.
  --force                Force a re-download of the requested version.

DESCRIPTION
  update the sunodoctl CLI

EXAMPLES
  Update to the stable channel:

    $ sunodoctl update stable

  Update to a specific version:

    $ sunodoctl update --version 1.0.0

  Interactively select version:

    $ sunodoctl update --interactive

  See available versions:

    $ sunodoctl update --available
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v3.1.3/src/commands/update.ts)_
<!-- commandsstop -->
