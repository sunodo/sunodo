// SPDX-License-Identifier: Apache-2.0
/// @title IPFS DApp Factory implementation
pragma solidity ^0.8.13;

import {ICartesiDAppFactory} from "@cartesi/rollups/contracts/dapp/CartesiDAppFactory.sol";
import {IConsensus} from "@cartesi/rollups/contracts/consensus/IConsensus.sol";
import {CartesiDApp} from "@cartesi/rollups/contracts/dapp/CartesiDApp.sol";
import {IMachineProtocol} from "../protocol/IMachineProtocol.sol";
import {ICartesiIPFSDAppFactory} from "./ICartesiIPFSDAppFactory.sol";

contract CartesiIPFSDAppFactory is ICartesiIPFSDAppFactory, IMachineProtocol {
    ICartesiDAppFactory immutable factory;

    constructor(ICartesiDAppFactory _factory) {
        factory = _factory;
    }

    /// @notice Instantiate a new dapp, including the IPFS CID information for the cartesi machine snapshot
    /// @dev This function delegates the construction of the dapp to a ICartesiDAppFactory, and emits an event with
    /// the IPFS CID of the snapshot of the corresponding machine. There is no validation onchain that the machine stored
    /// at IPFS matches the specified templateHash. This information will only be verified offchain when the dapp node
    /// start executing
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
    ) external override returns (CartesiDApp) {
        // delegate call to factory
        CartesiDApp dapp = factory.newApplication(
            _consensus,
            _dappOwner,
            _templateHash
        );

        // emit event to bind CID to application
        emit MachineLocation(block.chainid, address(dapp), _cid);

        // return application
        return dapp;
    }
}
