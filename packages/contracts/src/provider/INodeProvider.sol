// SPDX-License-Identifier: Apache-2.0
/// @title NodeProvider interfaces
pragma solidity ^0.8.30;

import {WithdrawalConfig} from "@cartesi/rollups/src/common/WithdrawalConfig.sol";
import {IConsensus} from "@cartesi/rollups/src/consensus/IConsensus.sol";
import {IApplication} from "@cartesi/rollups/src/dapp/IApplication.sol";
import {IInputBox} from "@cartesi/rollups/src/inputs/IInputBox.sol";

import {IVault} from "../payment/IVault.sol";

interface INodeProvider is IVault {
    /// @notice Register an application with the node provider
    /// @param application The application to be registered
    /// @param location The Cartesi machine snapshot location
    function register(IApplication application, string calldata location) external;

    /// @notice Sets a name for the provider using ENS service
    /// @param _name The name of the provider
    function setName(string calldata _name) external;
}

interface IReaderNodeProvider is INodeProvider {}

interface IValidatorNodeProvider is IReaderNodeProvider {
    /// @notice The consensus wired to the provider
    function consensus() external view returns (IConsensus);

    /// @notice The input box of the applications deployed through the provider
    function inputBox() external view returns (IInputBox);

    /// @notice Deploy a new application deterministically
    /// @param _owner The address that will own the application
    /// @param _templateHash The hash of the initial state of the Cartesi Machine
    /// @param _withdrawalConfig The withdrawal configuration of the application
    /// @param _location The Cartesi machine snapshot location
    /// @param _initialRunway The initial runway of the application in seconds
    /// @param _salt The salt used to deterministically generate the application address
    /// @return The application
    function deploy(
        address _owner,
        bytes32 _templateHash,
        WithdrawalConfig calldata _withdrawalConfig,
        string calldata _location,
        uint256 _initialRunway,
        bytes32 _salt
    ) external returns (IApplication);

    /// @notice Calculate the address of an application to be deployed deterministically.
    /// @param _owner The address that will own the application
    /// @param _templateHash The hash of the initial state of the Cartesi Machine
    /// @param _withdrawalConfig The withdrawal configuration of the application
    /// @param _salt The salt used to deterministically generate the application address
    /// @return The application address
    /// @dev Beware that only the `deploy` function with the `salt` parameter
    ///      is able to deterministically deploy an application.
    function calculateApplicationAddress(
        address _owner,
        bytes32 _templateHash,
        WithdrawalConfig calldata _withdrawalConfig,
        bytes32 _salt
    ) external view returns (address);
}
