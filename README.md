kaktus-cli
==========

CLI for the [Kaktus framework](https://github.com/Lelberto/kaktus)

[![Version](https://img.shields.io/npm/v/kaktus-cli.svg)](https://npmjs.org/package/kaktus-cli)
[![Downloads/week](https://img.shields.io/npm/dw/kaktus-cli.svg)](https://npmjs.org/package/kaktus-cli)
[![License](https://img.shields.io/npm/l/kaktus-cli.svg)](https://github.com/Lelberto/kaktus-cli/blob/master/package.json)

<!-- Summary -->
* [Usage](#usage)
* [Commands](#commands)
# Install
```sh-session
$ npm install -g kaktus-cli
OR
$ npx kaktus-cli ...
```
# Commands
* [`kaktus help [COMMAND]`](#kaktus-help-command)
* [`kaktus new APPNAME`](#kaktus-new-appname)
## `kaktus new APPNAME`

Create a new Kaktus application

```
USAGE
  $ kaktus new APPNAME

ARGUMENTS
  APPNAME  Your application name

OPTIONS
  -h, --help  show help
```

_See code: [src/commands/new.ts](https://github.com/Lelberto/kaktus-cli/blob/v1.0.0/src/commands/new.ts)_

## `kaktus help [COMMAND]`
```
USAGE
  $ kaktus help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.12/src/commands/help.ts)_
