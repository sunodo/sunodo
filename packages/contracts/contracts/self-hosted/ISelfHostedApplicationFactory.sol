// SPDX-License-Identifier: Apache-2.0
/// @title ApplicationFactory interface
pragma solidity ^0.8.13;

import {CartesiDApp} from "@cartesi/rollups/contracts/dapp/CartesiDApp.sol";

/// @notice SelfHostedApplicationFactory interface
interface ISelfHostedApplicationFactory {
    /// @notice Deploy a new authority, history and application deterministically.
    /// @param _authorityOwner The initial authority owner
    /// @param _dappOwner The initial DApp owner
    /// @param _templateHash The initial machine state hash
    /// @param _salt The salt used to deterministically generate the authority, history and application addresses
    /// @return The application
    function newApplication(
        address _authorityOwner,
        address _dappOwner,
        bytes32 _templateHash,
        bytes32 _salt
    ) external returns (CartesiDApp);

    /// @notice Calculate the address of an application to be deployed deterministically.
    /// @param _authorityOwner The initial authority owner
    /// @param _dappOwner The initial DApp owner
    /// @param _templateHash The initial machine state hash
    /// @param _salt The salt used to deterministically generate the DApp address
    /// @return The deterministic authority address, history address and application address
    function calculateApplicationAddress(
        address _authorityOwner,
        address _dappOwner,
        bytes32 _templateHash,
        bytes32 _salt
    ) external view returns (address, address, address);
}
