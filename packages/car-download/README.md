# IPFS CAR Download

This utility can be used to download an [IPFS CAR](https://ipld.io/specs/transport/car/carv1/) identified by a CID to a local directory. It takes advantage of IPFS properties like deduplication and content addressing to only download data that is not already present in the local filesystem and use symlinks to avoid duplicating data at rest.

## Example

The CID [bafybeibwirqufwrm5oohry2v22cmkgtx4sf2yszjikdpe4zlrraz66ewwm](https://explore.ipld.io/#/explore/bafybeibwirqufwrm5oohry2v22cmkgtx4sf2yszjikdpe4zlrraz66ewwm) is a `dag-pb` UnixFS directory, containing 11 files. Each file is identified by a CID and can be downloaded individually. So instead of downloading the entire CAR (over 400Mb) we can download only the files we still don't have. Note as well that some of the files have different names like `0000000060000000-200000.bin` and `0000000060200000-200000.bin` but have the same CID, as their contents are the same. So we can use symlinks to avoid not only downloading but also storing duplicated data.

## Usage

Install the package globally and run the command:

```shell
$ npm install -g @sunodo/car-download
$ car-download --help

Usage: car-download [options] <cid> [output]

Arguments:
  cid         Content ID of the CAR file
  output      Output directory (default: ".")

Options:
  -h, --help  display help for command
```

To download a CAR file to the current directory:

```shell
car-download bafybeibwirqufwrm5oohry2v22cmkgtx4sf2yszjikdpe4zlrraz66ewwm
```

## API

car-download can also be used as a library:

```shell
npm install @sunodo/car-download
```

```typescript
import { unixfs } from "@helia/unixfs";
import { carfs, text } from "@sunodo/car-download";
import { createHelia } from "helia";
import { CID } from "multiformats/cid";
import ora from "ora";

const helia = await createHelia();
const fs = unixfs(helia);
const car = carfs(fs);

for await (const file of car.ls(
    CID.parse("bafybeibwirqufwrm5oohry2v22cmkgtx4sf2yszjikdpe4zlrraz66ewwm"),
)) {
    const spinner = ora(file.path).start();
    for await (const progress of car.save(file, ".")) {
        spinner.text = text(progress);
        if (progress.status === "downloaded" || progress.status === "cached") {
            spinner.succeed();
        } else if (progress.status === "error") {
            spinner.fail(progress.error);
        }
    }
}
```
