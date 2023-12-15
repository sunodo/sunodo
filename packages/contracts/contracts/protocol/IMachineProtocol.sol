// SPDX-License-Identifier: Apache-2.0
/// @title Cartesi Machine Protocol
pragma solidity ^0.8.13;

/// @notice Interface that should be implemented by any contract which controls the association
/// of a deployed Cartesi application to its offchain Cartesi Machine snapshot.
interface IMachineProtocol {
    // Events

    /// @notice Signals the association of a application to its offchain Cartesi Machine
    /// @dev This event signals the association of an on-chain deployed Cartesi application to the offchain location of the
    /// snapshot of the Cartesi machine corresponding to the template hash stored on-chain. The format or protocol of
    /// the location field is not enforced on-chain and can follow any format, like a URL or an IPFS CID.
    /// @param application The application address
    /// @param location The storage location of the Cartesi machine snapshot
    event MachineLocation(address indexed application, string location);
}
