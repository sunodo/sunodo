# rollups-node

## 0.5.0

### Minor Changes

-   0306b48: use cartesi/rollups-node:1.1.0
-   ed66480: removes traefik from the rollups-node and exposes services ports

## 0.4.1

### Patch Changes

-   9d82fd7: bump rollups to 1.0.2

## 0.4.0

### Minor Changes

-   cd10c36: add host-runner to rollups-node docker image

### Patch Changes

-   57896a0: bump rollups to 1.0.1

## 0.3.0

### Minor Changes

-   fd0cc52: provision machine-snapshot from host to container
-   611c1ba: bump rollups to 1.0.0

## 0.2.0

### Minor Changes

-   e806582: moving contracts deployments from rollups-node to its own docker image with sunodo smart contracts added to rollups
-   6556a5d: bump rollups to 0.9.1
-   fd955e3: remove exports ports of postgres and redis

### Patch Changes

-   fd955e3: reduce some log verbosity
-   a6ad71e: log inspect-server and graphql-server endpoint urls
-   fd955e3: adding small delay to check of server-manager and state_server

## 0.1.1

### Patch Changes

-   6ebc662: - bump s6-overlay version to 3.1.5.0, verify checksum for s6-overlay binaries

## 0.1.0

### Minor Changes

-   d9f61b7: - add sunodo/rollups-node container image
