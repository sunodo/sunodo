// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import {History} from "@cartesi/rollups/contracts/history/History.sol";

/// @title History Factory interface
interface IHistoryFactory {
    // Events

    /// @notice A new history was deployed.
    /// @param historyOwner The initial history owner
    /// @param history The history
    /// @dev MUST be triggered on a successful call to `newHistory`.
    event HistoryCreated(address historyOwner, History history);

    // Permissionless functions

    /// @notice Deploy a new history.
    /// @param _historyOwner The initial history owner
    /// @return The history
    /// @dev On success, MUST emit a `HistoryCreated` event.
    function newHistory(address _historyOwner) external returns (History);

    /// @notice Deploy a new history deterministically.
    /// @param _historyOwner The initial history owner
    /// @param _salt The salt used to deterministically generate the history address
    /// @return The history
    /// @dev On success, MUST emit a `HistoryCreated` event.
    function newHistory(
        address _historyOwner,
        bytes32 _salt
    ) external returns (History);

    /// @notice Calculate the address of a history to be deployed deterministically.
    /// @param _historyOwner The initial history owner
    /// @param _salt The salt used to deterministically generate the history address
    /// @return The deterministic history address
    /// @dev Beware that only the `newHistory` function with the `_salt` parameter
    ///      is able to deterministically deploy a history.
    function calculateHistoryAddress(
        address _historyOwner,
        bytes32 _salt
    ) external view returns (address);
}
