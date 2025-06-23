// SPDX-License-Identifier: Apache-2.0
/// @title NodeProvider interfaces
pragma solidity ^0.8.20;

import {IApplication} from "@cartesi-rollups-contracts-2.0.0/dapp/IApplication.sol";
import {IOutputsMerkleRootValidator} from "@cartesi-rollups-contracts-2.0.0/consensus/IOutputsMerkleRootValidator.sol";

import {IVault} from "../payment/IVault.sol";

interface INodeProvider is IVault {
    /// @notice Register an application with the node provider
    /// @param application The application to be registered
    /// @param location The Cartesi machine snapshot location
    function register(
        IApplication application,
        string calldata location
    ) external;
}

interface IReaderNodeProvider is INodeProvider {}

interface IValidatorNodeProvider is IReaderNodeProvider {
    /// @notice The consensus wired to the provider
    function validator() external view returns (IOutputsMerkleRootValidator);

    /// @notice Deploy a new application deterministically
    /// @param _owner The address that will own the application
    /// @param _templateHash The hash of the initial state of the Cartesi Machine
    /// @param _dataAvailability The data availability solution used by the application
    /// @param _location The Cartesi machine snapshot location
    /// @param _initialRunway The initial runway of the application in seconds
    /// @param _salt The salt used to deterministically generate the application address
    /// @return The application
    function deploy(
        address _owner,
        bytes32 _templateHash,
        bytes calldata _dataAvailability,
        string calldata _location,
        uint256 _initialRunway,
        bytes32 _salt
    ) external returns (IApplication);

    /// @notice Calculate the address of an application to be deployed deterministically.
    /// @param _owner The address that will own the application
    /// @param _templateHash The hash of the initial state of the Cartesi Machine
    /// @param _dataAvailability The data availability solution used by the application
    /// @param _salt The salt used to deterministically generate the application address
    /// @return The application address
    /// @dev Beware that only the `deploy` function with the `salt` parameter
    ///      is able to deterministically deploy an application.
    function calculateApplicationAddress(
        address _owner,
        bytes32 _templateHash,
        bytes calldata _dataAvailability,
        bytes32 _salt
    ) external view returns (address);
}
