// SPDX-License-Identifier: Apache-2.0
/// @title DApp Vault
pragma solidity ^0.8.13;

import {ICartesiDApp} from "@cartesi/rollups/contracts/dapp/ICartesiDApp.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice Vault interface that adds a payment specification for the execution of application nodes
/// @dev The implemented model is that the service provider and implement a smart contract that returns the cost per
/// unit of time, manages the runway of applications and receives deposits to extends those runways.
interface IVault {
    // Permissionless functions

    /// @notice Returns the cost of running an application for a given time
    /// @param _time The time in seconds
    /// @return The cost in amount of ERC-20 tokens
    function cost(uint256 _time) external view returns (uint256);

    /// @notice The token used by the vault
    function token() external view returns (IERC20);

    /// @notice The address which will receive payments for the applications
    function payee() external view returns (address);

    /// @notice Returns the runway of a given application
    /// @param _dapp The application address
    function runway(ICartesiDApp _dapp) external view returns (uint256);

    /// @notice Extend the runway of a given application by an amount of time
    /// @param _dapp The application
    /// @param _time The amount of time to extend the runway (will trigger transfer)
    function extendRunway(
        ICartesiDApp _dapp,
        uint _time
    ) external returns (uint256);
}
