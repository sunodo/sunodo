# Contracts

The [Cartesi Node](https://github.com/cartesi/rollups-node) provided by the Cartesi team allows anyone to run a node for a specific application assuming they have the Cartesi machine initial snapshot in hand, and have the financial incentives to run it, which typically has computational and storage costs.

The goal of the smart contracts in this package is to support an incentivized and decentralized way of delegating the execution of Cartesi Nodes for applications to third-party service providers.

Two protocols are defined to support this goal: [IMachineProtocol](contracts/protocol/IMachineProtocol.sol) and [IFinancialProtocol](contracts/protocol/IFinancialProtocol.sol).

## Protocols

### IMachineProtocol

```solidity
interface IMachineProtocol {
    event MachineLocation(address indexed dapp, string location);
}
```

This allows the on-chain specification of where the service provider can download the Cartesi machine snapshot from. The protocol does not enforce the method used for the location, it can be a public URL, an IPFS CID, a local path, etc.

### IFinancialProtocol

```solidity
interface IFinancialProtocol {
    event FinancialRunway(address indexed dapp, uint256 until);
}
```

This protocol allows a service provider to know how long an application has enough funds to run. Of course it is a choice of the service provider off-chain node manager to decide which smart contract implementation to watch for `IFinancialProtocol` events.
