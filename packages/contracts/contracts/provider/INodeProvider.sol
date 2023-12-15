// SPDX-License-Identifier: Apache-2.0
/// @title NodeProvider interfaces
pragma solidity ^0.8.13;

import {CartesiDApp} from "@cartesi/rollups/contracts/dapp/CartesiDApp.sol";
import {ICartesiDApp} from "@cartesi/rollups/contracts/dapp/ICartesiDApp.sol";
import {IConsensus} from "@cartesi/rollups/contracts/consensus/IConsensus.sol";

import {IVault} from "../payment/IVault.sol";

interface INodeProvider is IVault {
    /// @notice Register an application with the node provider
    /// @param application The application to be registered
    /// @param location The Cartesi machine snapshot location
    function register(
        ICartesiDApp application,
        string calldata location
    ) external;

    /// @notice Sets a name for the provider using ENS service
    /// @param _name The name of the provider
    function setName(string calldata _name) external;
}

interface IReaderNodeProvider is INodeProvider {}

interface IValidatorNodeProvider is IReaderNodeProvider {
    /// @notice The consensus wired to the provider
    function consensus() external view returns (IConsensus);

    /// @notice Deploy a new application
    /// @param _owner The address that will own the application
    /// @param _templateHash The hash of the initial state of the Cartesi Machine
    /// @param _location The Cartesi machine snapshot location
    /// @param _initialRunway The initial runway of the application in seconds
    /// @return The application
    function deploy(
        address _owner,
        bytes32 _templateHash,
        string calldata _location,
        uint256 _initialRunway
    ) external returns (CartesiDApp);
}
