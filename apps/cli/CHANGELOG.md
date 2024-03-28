# Changelog

## 0.11.2

### Patch Changes

- 87aaf79: fix no-backend mode

## 0.11.1

### Patch Changes

- 22c2ac7: fix default template branch

## 0.11.0

### Minor Changes

- 4f378cb: use cartesi/rollups-node:0.7.0 instead of our own sunodo/rollups-node
- 5275f61: add deploy command for self-hosted deployment
- faf2df8: upgrade rollups-explorer to current version
- 93aa5e5: add sunodo hash command
- 394cc65: change default epoch duration from 1 day to 1 hour
- 1fa988a: bump devnet version
- 1ee42f0: add private key option to wallet connection

### Patch Changes

- 9d4cb5e: make sunodo send erc20 ask for the amount
- 3f5c963: make application builds reproducible
- 2552670: reduce sunodo run verbosity

## 0.10.4

### Patch Changes

- e4e6837: fix .sunodo/ files permissions (#352)
- 2176d01: prepare to enable external database
- fcfa06a: extract prompt service to its own compose file
- 74d62da: invert service dependency on compose files
- fe7e52f: add --listen-port to run command
- 121efc2: fix --json command flag

## 0.10.3

### Patch Changes

- d67a529: refactor docker compose files

## 0.10.2

### Patch Changes

- f52ec03: bump to sunodo/rollups-node:0.6.1

## 0.10.1

### Patch Changes

- 887649c: fix sunodo/rollups-node version

## 0.10.0

### Minor Changes

- 90a783b: adapt to sunodo/rollups-node:0.6.0

### Patch Changes

- cb3c899: fix .sunodo/ permission during build

## 0.9.5

### Patch Changes

- 320df7b: sync advance-runner and s6-rc timeouts

## 0.9.4

### Patch Changes

- ff2d7ce: Remove the prompt Docker volume and use environment variables instead.
- 8c7d10e: use env_file: over environment: at compose
- 36c43c7: fix epoch closing
- 8237cc3: Add traefik config generator compose file to use shared volume in traefik.

## 0.9.3

### Patch Changes

- b2bce2d: update anvil version

## 0.9.2

### Patch Changes

- 5bda3e6: revert viem back to 1.15.4 (https://github.com/wagmi-dev/viem/issues/1323)

## 0.9.1

### Patch Changes

- 71e7c44: add docker compose snapshot volumes for different sunodo run options

## 0.9.0

### Minor Changes

- 149d2ba: bump sunodo/rollups-node to 0.5.0, which uses cartesi/rollups-node 1.1.0
- c5cf99e: add rollups-explorer to sunodo local runtime environment

## 0.8.4

### Patch Changes

- 7a39ead: sunodo run will accept a .sunodo.env file

## 0.8.3

### Patch Changes

- 8710678: fix send --chain-id for local devnet
- 5b616e7: fix regression on address-book outside a dapp directory

## 0.8.2

### Patch Changes

- 9515326: bump minimum docker compose version to 2.21.0 (docker breaking change)

## 0.8.1

### Patch Changes

- 9d82fd7: bump rollups to 1.0.2

## 0.8.0

### Minor Changes

- 384b808: add no-backend flag to sunodo run command

### Patch Changes

- 26169e2: fix error message of graceful shutdown of sunodo run
- 57896a0: bump rollups to 1.0.1
- 426a213: fix address-book so getting dapp address works with no-backend

## 0.7.1

### Patch Changes

- ab2066c: add typescript template
- 9551a97: fix brew installation
- 658f9d1: add rust template
- b0219f8: change default sunodo/sunodo-templates repository default branch the create command uses
- 6a26d4c: bump devnet to 1.1.0

## 0.7.0

### Minor Changes

- 6f76cf8: hide host's machine-snapshot from validator container
- 3502bba: bump machine-emulator-sdk to 0.16.2
- 28e7bdc: replacing `network` command option with `chain-id`, which is always an integer
- 120239b: remove the --network option of sunodo build
- 611c1ba: bump rollups to 1.0.0

### Patch Changes

- 918601a: fix check of send generic hex value

## 0.6.0

### Minor Changes

- 553fa5d: new command `sunodo send` and its sub-commands to send inputs
- 97a35e0: new command `sunodo doctor` to check system requirements
- 553fa5d: new command `sunodo address-book` to know the addresses of deployed contracts
- cbddb6f: new `sunodo create` templates for `go` and `ruby`
- fd955e3: adjust non-verbose mode of `sunodo run` to always print output of the application
- e175be4: bump rollups to 0.9.1

## 0.5.0

### Minor Changes

- 240b9ac: add new templates (cpp, cpp-low-level, lua)

### Patch Changes

- 8faed78: fix issue #68 using retar tool of new SDK
- 0908b7c: bump to sunodo/rollups-node:0.1.1
- ad9d396: change default SDK version to 0.15.0

## 0.4.0

### Minor Changes

- cd8a3f4: - new `sunodo run` command

## 0.3.1

### Minor Changes

- Fix [#34](https://github.com/sunodo/sunodo/issues/34)

## 0.3.0

### Minor Changes

- First version using new web3 architecture
- Initial version of `sunodo build`
- Initial version of `sunodo clean`
- Initial version of `sunodo shell`

## 0.2.0

### Minor Changes

- First working version of CLI with deployed API
  ansactions

## 0.1.0

### Minor Changes

- First prototype
