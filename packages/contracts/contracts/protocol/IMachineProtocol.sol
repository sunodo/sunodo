// SPDX-License-Identifier: Apache-2.0
/// @title Cartesi Machine Protocol
pragma solidity ^0.8.13;

/// @notice Interface that should be implemented by any contract which controls the association
/// of a deployed Cartesi DApp to its offchain Cartesi Machine snapshot.
interface IMachineProtocol {
    // Events

    /// @notice Signals the association of a dapp to its offchain Cartesi Machine
    /// @dev This event signals the association of an onchain deployed Cartesi DApp to the offchain location of the
    /// snapshot of the Cartesi machine corresponding to the template hash stored onchain. The format or protocol of
    /// the location field is not enforced onchain and can follow any format, like a URL or an IPFS CID.
    /// @param dapp The dapp address
    /// @param location The storage location of the cartesi machine snapshot
    event MachineLocation(address indexed dapp, string location);
}
