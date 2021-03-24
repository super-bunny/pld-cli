# PLD CLI

CLI that groups some utilities for PLD files 🔧

⚠ PLD files must respect this JSON schema: [super-bunny/pld-json-schema](https://github.com/super-bunny/pld-json-schema)

## Installation

With npm:

```bash
npm install -g pld-cli
```

With yarn:

```bash
yarn global add pld-cli
```

## Usage

```
$ pld -h

Usage: pld [options] [command]

Command line utility for pld file

Options:
  -V, --version               output the version number
  -f, --file <pld_file_path>  pld file the cli will use
  -d, --dir <pld_dir_path>    directory where cli will search for pld file
  --script                    will print command outputs in JSON and without any logs
  -h, --help                  display help for command

Commands:
  version                     get pld latest version number
  duration                    get estimated duration sum of pld user stories
  assignees [options] <user>  list user stories assigned to specified user
  help [command]              display help for command
```
