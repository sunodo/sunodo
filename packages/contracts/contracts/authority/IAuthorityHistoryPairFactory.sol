// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import {Authority} from "@cartesi/rollups/contracts/consensus/authority/Authority.sol";
import {History} from "@cartesi/rollups/contracts/history/History.sol";
import {IInputBox} from "@cartesi/rollups/contracts/inputs/IInputBox.sol";

import {IAuthorityFactory} from "./IAuthorityFactory.sol";
import {IHistoryFactory} from "./IHistoryFactory.sol";

/// @title Authority-History Pair Factory interface
interface IAuthorityHistoryPairFactory {
    // Events

    /// @notice The factory was created.
    /// @param authorityFactory The underlying `Authority` factory
    /// @param historyFactory The underlying `History` factory
    /// @dev MUST be emitted on construction.
    event AuthorityHistoryPairFactoryCreated(
        IAuthorityFactory authorityFactory,
        IHistoryFactory historyFactory
    );

    // Permissionless functions

    /// @notice Get the factory used to deploy `Authority` contracts
    /// @return The `Authority` factory
    function getAuthorityFactory() external view returns (IAuthorityFactory);

    /// @notice Get the factory used to deploy `History` contracts
    /// @return The `History` factory
    function getHistoryFactory() external view returns (IHistoryFactory);

    /// @notice Deploy a new authority-history pair.
    /// @param _authorityOwner The initial authority owner
    /// @return The authority
    /// @return The history
    function newAuthorityHistoryPair(
        address _authorityOwner
    ) external returns (Authority, History);

    /// @notice Deploy a new authority-history pair deterministically.
    /// @param _authorityOwner The initial authority owner
    /// @param _salt The salt used to deterministically generate the authority-history pair address
    /// @return The authority
    /// @return The history
    function newAuthorityHistoryPair(
        address _authorityOwner,
        bytes32 _salt
    ) external returns (Authority, History);

    /// @notice Calculate the address of an authority-history pair to be deployed deterministically.
    /// @param _salt The salt used to deterministically generate the authority-history address pair
    /// @return The deterministic authority address
    /// @return The deterministic history address
    /// @dev Beware that only the `newAuthorityHistoryPair` function with the `_salt` parameter
    ///      is able to deterministically deploy an authority-history pair.
    function calculateAuthorityHistoryAddressPair(
        bytes32 _salt
    ) external view returns (address, address);
}
