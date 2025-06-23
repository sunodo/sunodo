// SPDX-License-Identifier: Apache-2.0
/// @title Vault interface
pragma solidity ^0.8.20;

import {IApplication} from "@cartesi-rollups-contracts-2.0.0/dapp/IApplication.sol";
import {IERC20} from "@openzeppelin-contracts-5.2.0/token/ERC20/IERC20.sol";

/// @notice Vault interface that adds a payment specification for the execution of applications
/// @dev The implementation should specify a token as payment method, and calculate the price for a
/// specified amount of execution time of the application node.
interface IVault {
    // Permissionless functions

    /// @notice Returns the cost of running an application for a given time
    /// @param _time The time in seconds
    /// @return The cost in amount of ERC-20 tokens
    function cost(uint256 _time) external view returns (uint256);

    /// @notice The token used by the vault
    function token() external view returns (IERC20);

    /// @notice The address which will receive payments for the application node execution
    function payee() external view returns (address);

    /// @notice Returns the runway of a given application
    /// @dev Runway is the amount of time (in seconds) an application node has funds to run
    /// @param _application The application address
    function runway(IApplication _application) external view returns (uint256);

    /// @notice Extend the runway of a given application by an amount of time
    /// @dev The user must approve the token transfer from the caller to the payee beforehand.
    /// @param _application The application
    /// @param _time The amount of time to extend the runway (will trigger transfer)
    function extendRunway(
        IApplication _application,
        uint256 _time
    ) external returns (uint256);
}
