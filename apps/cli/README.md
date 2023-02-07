oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
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
* [`sunodoctl auth login`](#sunodoctl-auth-login)
* [`sunodoctl auth logout`](#sunodoctl-auth-logout)
* [`sunodoctl help [COMMANDS]`](#sunodoctl-help-commands)
* [`sunodoctl platform chains`](#sunodoctl-platform-chains)
* [`sunodoctl platform regions`](#sunodoctl-platform-regions)
* [`sunodoctl platform runtimes`](#sunodoctl-platform-runtimes)
* [`sunodoctl plugins`](#sunodoctl-plugins)
* [`sunodoctl plugins:install PLUGIN...`](#sunodoctl-pluginsinstall-plugin)
* [`sunodoctl plugins:inspect PLUGIN...`](#sunodoctl-pluginsinspect-plugin)
* [`sunodoctl plugins:install PLUGIN...`](#sunodoctl-pluginsinstall-plugin-1)
* [`sunodoctl plugins:link PLUGIN`](#sunodoctl-pluginslink-plugin)
* [`sunodoctl plugins:uninstall PLUGIN...`](#sunodoctl-pluginsuninstall-plugin)
* [`sunodoctl plugins:uninstall PLUGIN...`](#sunodoctl-pluginsuninstall-plugin-1)
* [`sunodoctl plugins:uninstall PLUGIN...`](#sunodoctl-pluginsuninstall-plugin-2)
* [`sunodoctl plugins update`](#sunodoctl-plugins-update)
* [`sunodoctl update [CHANNEL]`](#sunodoctl-update-channel)

## `sunodoctl auth login`

Login or Signup to Sunodo

```
USAGE
  $ sunodoctl auth login

DESCRIPTION
  Login or Signup to Sunodo

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

## `sunodoctl plugins`

List installed plugins.

```
USAGE
  $ sunodoctl plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ sunodoctl plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.3.0/src/commands/plugins/index.ts)_

## `sunodoctl plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ sunodoctl plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ sunodoctl plugins add

EXAMPLES
  $ sunodoctl plugins:install myplugin 

  $ sunodoctl plugins:install https://github.com/someuser/someplugin

  $ sunodoctl plugins:install someuser/someplugin
```

## `sunodoctl plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ sunodoctl plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ sunodoctl plugins:inspect myplugin
```

## `sunodoctl plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ sunodoctl plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ sunodoctl plugins add

EXAMPLES
  $ sunodoctl plugins:install myplugin 

  $ sunodoctl plugins:install https://github.com/someuser/someplugin

  $ sunodoctl plugins:install someuser/someplugin
```

## `sunodoctl plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ sunodoctl plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ sunodoctl plugins:link myplugin
```

## `sunodoctl plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ sunodoctl plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ sunodoctl plugins unlink
  $ sunodoctl plugins remove
```

## `sunodoctl plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ sunodoctl plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ sunodoctl plugins unlink
  $ sunodoctl plugins remove
```

## `sunodoctl plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ sunodoctl plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ sunodoctl plugins unlink
  $ sunodoctl plugins remove
```

## `sunodoctl plugins update`

Update installed plugins.

```
USAGE
  $ sunodoctl plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
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
