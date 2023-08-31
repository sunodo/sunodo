# Changelog

## 0.7.0

### Minor Changes

-   6f76cf8: hide host's machine-snapshot from validator container
-   3502bba: bump machine-emulator-sdk to 0.16.2
-   28e7bdc: replacing `network` command option with `chain-id`, which is always an integer
-   120239b: remove the --network option of sunodo build
-   611c1ba: bump rollups to 1.0.0

### Patch Changes

-   918601a: fix check of send generic hex value

## 0.6.0

### Minor Changes

-   553fa5d: new command `sunodo send` and its sub-commands to send inputs
-   97a35e0: new command `sunodo doctor` to check system requirements
-   553fa5d: new command `sunodo address-book` to know the addresses of deployed contracts
-   cbddb6f: new `sunodo create` templates for `go` and `ruby`
-   fd955e3: adjust non-verbose mode of `sunodo run` to always print output of the application
-   e175be4: bump rollups to 0.9.1

## 0.5.0

### Minor Changes

-   240b9ac: add new templates (cpp, cpp-low-level, lua)

### Patch Changes

-   8faed78: fix issue #68 using retar tool of new SDK
-   0908b7c: bump to sunodo/rollups-node:0.1.1
-   ad9d396: change default SDK version to 0.15.0

## 0.4.0

### Minor Changes

-   cd8a3f4: - new `sunodo run` command

## 0.3.1

### Minor Changes

-   Fix [#34](https://github.com/sunodo/sunodo/issues/34)

## 0.3.0

### Minor Changes

-   First version using new web3 architecture
-   Initial version of `sunodo build`
-   Initial version of `sunodo clean`
-   Initial version of `sunodo shell`

## 0.2.0

### Minor Changes

-   First working version of CLI with deployed API
    ansactions

## 0.1.0

### Minor Changes

-   First prototype
