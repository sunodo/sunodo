// SPDX-License-Identifier: Apache-2.0
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
    /// @param dapp The dapp address
    /// @param until The point in time when the dapp will run out of funds (seconds since epoch)
    event FinancialRunway(address indexed dapp, uint256 until);
}
