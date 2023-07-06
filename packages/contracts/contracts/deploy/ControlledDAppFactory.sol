// SPDX-License-Identifier: Apache-2.0
/// @title Controlled DApp Factory
pragma solidity ^0.8.13;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IConsensus} from "@cartesi/rollups/contracts/consensus/IConsensus.sol";
import {ICartesiDAppFactory} from "@cartesi/rollups/contracts/dapp/CartesiDAppFactory.sol";
import {CartesiDApp} from "@cartesi/rollups/contracts/dapp/CartesiDApp.sol";
import {CartesiIPFSDAppFactory} from "../factory/CartesiIPFSDAppFactory.sol";
import {IFinancialProtocol} from "../protocol/IFinancialProtocol.sol";

/// @notice This dapp factory implements the IFinancialProtocol with total control over the execution of the validator.
/// @dev This can be used for test scenarios, where you can manuall start and stop the validator by sending a transaction.
contract ControlledDAppFactory is
    AccessControl,
    CartesiIPFSDAppFactory,
    IFinancialProtocol
{
    /// Create a new role identifier for the controller role, they can start/stop dapps
    bytes32 public constant CONTROLLER_ROLE = keccak256("CONTROLLER_ROLE");

    constructor(ICartesiDAppFactory _factory) CartesiIPFSDAppFactory(_factory) {
        _grantRole(CONTROLLER_ROLE, msg.sender);
    }

    function start(address _dapp) external onlyRole(CONTROLLER_ROLE) {
        // emits event to run the node
        emit FinancialRunway(block.chainid, _dapp, type(uint256).max);
    }

    function stop(address _dapp) external onlyRole(CONTROLLER_ROLE) {
        // emits event to stop the node
        emit FinancialRunway(block.chainid, _dapp, block.timestamp);
    }
}
