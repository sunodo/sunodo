// SPDX-License-Identifier: MIT
/// @title IPFS DApp Factory interface
pragma solidity ^0.8.13;

import {CartesiDApp} from "@cartesi/rollups/contracts/dapp/CartesiDApp.sol";
import {IConsensus} from "@cartesi/rollups/contracts/consensus/IConsensus.sol";

/// @notice Interface that wraps the ICartesiDAppFactory and adds the IPFS CID information to the dapp
/// instantiation process
interface ICartesiIPFSDAppFactory {
    // Permissionless functions

    /// @notice Deploy a new application
    /// @dev Adds an IPFS CID parameter to the original ICartesiDAppFactory interface
    /// @param _consensus The consensus to which the DApp should be subscribed
    /// @param _dappOwner The address that should own the DApp
    /// @param _templateHash The hash of the initial state of the Cartesi Machine
    /// @param _cid The IPFS CID of the cartesi machine snapshot
    /// @return The application
    function newApplication(
        IConsensus _consensus,
        address _dappOwner,
        bytes32 _templateHash,
        string memory _cid
    ) external returns (CartesiDApp);
}
