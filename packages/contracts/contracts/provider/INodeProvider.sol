// SPDX-License-Identifier: Apache-2.0
/// @title Payment DApp Factory interface
pragma solidity ^0.8.13;

import {CartesiDApp} from "@cartesi/rollups/contracts/dapp/CartesiDApp.sol";
import {ICartesiDApp} from "@cartesi/rollups/contracts/dapp/ICartesiDApp.sol";
import {IConsensus} from "@cartesi/rollups/contracts/consensus/IConsensus.sol";

import {IVault} from "../payment/IVault.sol";

interface INodeProvider is IVault {
    /// @notice Register a dapp with the node provider
    /// @param dapp The dapp to be registered
    /// @param location The cartesi machine snapshot location
    function register(ICartesiDApp dapp, string memory location) external;

    /// @notice Sets a name for the provider using ENS service
    /// @param _name The name of the provider
    function setName(string memory _name) external;
}

interface IReaderNodeProvider is INodeProvider {}

interface IValidatorNodeProvider is IReaderNodeProvider {
    /// @notice The consensus wired to the provider
    function consensus() external view returns (IConsensus);

    /// @notice Deploy a new application
    /// @param _dappOwner The address that should own the DApp
    /// @param _templateHash The hash of the initial state of the Cartesi Machine
    /// @param _location The cartesi machine snapshot location
    /// @param _initialRunway The initial runway of the application in seconds
    /// @return The application
    function deploy(
        address _dappOwner,
        bytes32 _templateHash,
        string memory _location,
        uint256 _initialRunway
    ) external returns (CartesiDApp);
}
