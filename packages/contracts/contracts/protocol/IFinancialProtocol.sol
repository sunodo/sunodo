// SPDX-License-Identifier: MIT
/// @title DApp Financial Protocol
pragma solidity ^0.8.13;

/// @notice Interface that should be implemented by any contract which dictates the financial incentives
/// of the execution of validator nodes for Cartesi DApps.
interface IFinancialProtocol {
    // Events

    /// @notice Signals until when a dapp has enough funds to be validated
    /// @dev This event signals until when the validator node for the dapp should be running.
    /// The offchain implementation which controls the execution of validator nodes is free
    /// to choose which implementation contracts they will rely on for this information.
    /// The dapp can be deployed on a different network than the one this event is emitted on.
    /// @param chainid The chainid of the network the dapp is deployed
    /// @param dapp The dapp address
    /// @param until The point in time when the dapp will run out of funds (seconds since epoch)
    event FinancialRunway(uint256 chainid, address dapp, uint256 until);
}
