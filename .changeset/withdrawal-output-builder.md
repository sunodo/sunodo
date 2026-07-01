---
"@sunodo/web": minor
---

Add a withdrawal output builder option to the deploy page. Besides pasting the address of an existing `IWithdrawalOutputBuilder` implementation, users can now deploy a USD withdrawal output builder for an ERC-20 token via the `UsdWithdrawalOutputBuilderFactory` (deployed on supported testnets), which reuses an already-deployed builder for the same token when one exists.
