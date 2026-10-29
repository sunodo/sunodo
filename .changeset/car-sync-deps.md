---
"@sunodo/car-sync": minor
---

Update dependencies, including the Helia 7 IPFS stack (`helia` 7, `@helia/unixfs` 8, `ipfs-unixfs-importer` 17, `multiformats` 14), commander 15, chalk 6 and ora 9. Node.js 22.12 or later is now required.

Breaking changes for library users:

- `carfs().ls()` yields `CARFile` objects (`cid`, `path`, `size`) instead of `ipfs-unixfs-exporter` entries, and `FileProgress.file` is a `CARFile`. File content is read through the `UnixFS` instance passed to `carfs()`.
- Only the ESM build is published. The CommonJS build was not referenced by `package.json` and failed to load.

The CLI ignores an unhandled "ReadableStream is locked" rejection raised by `@helia/delegated-routing-v1-http-api-client` when provider lookups are aborted, which otherwise crashes downloads.
