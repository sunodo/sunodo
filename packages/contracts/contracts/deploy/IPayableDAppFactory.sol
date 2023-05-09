// SPDX-License-Identifier: MIT
/// @title Payment DApp Factory interface
pragma solidity ^0.8.13;

import {CartesiDApp} from "@cartesi/rollups/contracts/dapp/CartesiDApp.sol";
import {IConsensus} from "@cartesi/rollups/contracts/consensus/IConsensus.sol";

/// @notice DApp factory interface that adds a payment specification to the instantiation of dapps
/// @dev The implemented model is that the dapp instantiator will define how much he is willing to pay per time unit
/// of validation, and how much he is commiting in advance. This interface is not bounded to tokens, but any uint unit
/// of measure.
interface IPayableDAppFactory {
    // Permissionless functions

    /// @notice Deploy a new application
    /// @param _consensus The consensus to which the DApp should be subscribed
    /// @param _dappOwner The address that should own the DApp
    /// @param _templateHash The hash of the initial state of the Cartesi Machine
    /// @param _cid The IPFS CID of the cartesi machine snapshot
    /// @param _salary the amount of tokens the DApp pays to
    ///                its consensus every second, a.k.a. salary
    /// @param _funds the amount of tokens to be deposited into
    ///               the DApp's funds account
    /// @return The application
    function newApplication(
        IConsensus _consensus,
        address _dappOwner,
        bytes32 _templateHash,
        string memory _cid,
        uint128 _salary,
        uint128 _funds
    ) external returns (CartesiDApp);
}
