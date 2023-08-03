// SPDX-License-Identifier: Apache-2.0
/// @title Payment DApp Factory interface
pragma solidity ^0.8.13;

import {IConsensus} from "@cartesi/rollups/contracts/consensus/IConsensus.sol";
import {CartesiDApp} from "@cartesi/rollups/contracts/dapp/CartesiDApp.sol";
import {ICartesiDApp} from "@cartesi/rollups/contracts/dapp/ICartesiDApp.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice DApp factory interface that adds a payment specification to the instantiation of dapps
/// @dev The implemented model is that the dapp instantiator will define how much he is willing to pay per time unit
/// of validation, and how much he is commiting in advance. This interface is not bounded to tokens, but any uint unit
/// of measure.
interface IPayableDAppFactory {
    // Permissionless functions

    /// @notice Deploy a new application
    /// @param _dappOwner The address that should own the DApp
    /// @param _templateHash The hash of the initial state of the Cartesi Machine
    /// @param _cid The IPFS CID of the cartesi machine snapshot
    /// @param _runway the amount of time in seconds the dapp will be running (will trigger transfer)
    /// @return The application
    function newApplication(
        address _dappOwner,
        bytes32 _templateHash,
        string memory _cid,
        uint256 _runway
    ) external returns (CartesiDApp);

    /// @notice Import an existing dapp to be managed by this factory
    /// @param _dapp The dapp to be imported
    /// @param _cid The IPFS CID of the cartesi machine snapshot
    /// @param _runway the amount of time in seconds the dapp will be running (will trigger transfer)
    function importApplication(
        CartesiDApp _dapp,
        string memory _cid,
        uint256 _runway
    ) external;

    /// @notice Returns the cost of running a DApp for a given time
    /// @param _time The time in seconds
    /// @return The cost in amount of ERC-20 tokens
    function cost(uint256 _time) external view returns (uint256);

    /// @notice The token used by the factory as financial incentive
    function token() external view returns (IERC20);

    /// @notice The consensus wired to the factory
    function consensus() external view returns (IConsensus);

    /// @notice Returns the runway of a given DApp
    /// @param _dapp The DApp address
    function runway(ICartesiDApp _dapp) external view returns (uint256);

    /// @notice Extend the runway of a given DApp by an amount of time
    /// @param _dapp The DApp
    /// @param _time The amount of time to extend the runway (will trigger transfer)
    function extendRunway(
        ICartesiDApp _dapp,
        uint _time
    ) external returns (uint256);
}
