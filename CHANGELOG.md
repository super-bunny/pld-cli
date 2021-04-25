# Changelog

## [Unreleased](https://github.com/super-bunny/pld-cli/tree/dev)

**Features:**

- CLI update notifier
- Auto wrap long lines on user story card print (> 100 characters)

**Commands:**

- New `user-story` command: group user story related commands
    - `list` sub command (default): list user stories with optional filters
    - `search` sub command: alias for `list` command with `--search` option


- New `distribution` command: get user stories duration distribution


- `assignees` now act as an alias for `user-story list` command with `--assignments` option

**BREAKING CHANGES:**

- `assignees` command output in script mode have different json structure:
  - key renamed:`assignees` ➡ `userStories`

## [0.1.0](https://github.com/super-bunny/pld-cli/releases/tag/v0.1.0) (2021-03-24)

*First release*

**Features:**

- `version` command: get pld latest version number
- `duration` command: get estimated duration sum of pld user stories
- `assignees` command: list user stories assigned to specified user 
