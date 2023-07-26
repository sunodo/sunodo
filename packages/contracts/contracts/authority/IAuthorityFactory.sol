// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import {Authority} from "@cartesi/rollups/contracts/consensus/authority/Authority.sol";

/// @title Authority Factory interface
interface IAuthorityFactory {
    // Events

    /// @notice A new authority was deployed.
    /// @param authority The authority
    /// @dev MUST be triggered on a successful call to `newAuthority`.
    event AuthorityCreated(Authority authority);

    // Permissionless functions

    /// @notice Deploy a new authority.
    /// @return The authority
    /// @dev On success, MUST emit an `AuthorityCreated` event.
    function newAuthority() external returns (Authority);

    /// @notice Deploy a new authority.
    /// @param _authorityOwner The initial authority owner
    /// @return The authority
    /// @dev On success, MUST emit an `AuthorityCreated` event.
    function newAuthority(address _authorityOwner) external returns (Authority);

    /// @notice Deploy a new authority deterministically.
    /// @param _authorityOwner The initial authority owner
    /// @param _salt The salt used to deterministically generate the authority address
    /// @return The authority
    /// @dev On success, MUST emit an `AuthorityCreated` event.
    function newAuthority(
        address _authorityOwner,
        bytes32 _salt
    ) external returns (Authority);

    /// @notice Deploy a new authority deterministically.
    /// @param _salt The salt used to deterministically generate the authority address
    /// @return The authority
    /// @dev On success, MUST emit an `AuthorityCreated` event.
    function newAuthority(bytes32 _salt) external returns (Authority);

    /// @notice Calculate the address of an authority to be deployed deterministically.
    /// @param _authorityOwner The initial authority owner
    /// @param _salt The salt used to deterministically generate the authority address
    /// @return The deterministic authority address
    /// @dev Beware that only the `newAuthority` function with the `_salt` parameter
    ///      is able to deterministically deploy an authority.
    function calculateAuthorityAddress(
        address _authorityOwner,
        bytes32 _salt
    ) external view returns (address);
}
