# @sunodo/web

## 0.4.0

### Minor Changes

- 3a635e2: Add a withdrawal output builder option to the deploy page. Besides pasting the address of an existing `IWithdrawalOutputBuilder` implementation, users can now deploy a USD withdrawal output builder for an ERC-20 token via the `UsdWithdrawalOutputBuilderFactory` (deployed on supported testnets), which reuses an already-deployed builder for the same token when one exists.

## 0.3.0

### Minor Changes

- 2322f8d: compatibility with node 1.5.0

## 0.2.0

### Minor Changes

- 243c721: use SelfHostedApplicationFactory from @cartesi/rollups
- 31f0894: add base_sepolia

### Patch Changes

- fbb1747: support to base network

## 0.1.0

### Minor Changes

- ace2633: deploy page for self-hosted deployment
