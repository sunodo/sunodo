// SPDX-License-Identifier: Apache-2.0
/// @title SelfHostedApplicationFactory
pragma solidity ^0.8.13;

import {Authority} from "@cartesi/rollups/contracts/consensus/authority/Authority.sol";
import {IAuthorityHistoryPairFactory} from "@cartesi/rollups/contracts/consensus/authority/IAuthorityHistoryPairFactory.sol";
import {IConsensus} from "@cartesi/rollups/contracts/consensus/IConsensus.sol";
import {CartesiDApp} from "@cartesi/rollups/contracts/dapp/CartesiDApp.sol";
import {CartesiDAppFactory} from "@cartesi/rollups/contracts/dapp/CartesiDAppFactory.sol";

import {ISelfHostedApplicationFactory} from "./ISelfHostedApplicationFactory.sol";

/// @notice This contract implements an ISelfHostedApplicationFactory.
contract SelfHostedApplicationFactory is ISelfHostedApplicationFactory {
    IAuthorityHistoryPairFactory immutable authorityHistoryPairFactory;
    CartesiDAppFactory immutable applicationFactory;

    /// @notice Construct a new SelfHostedApplicationFactory
    /// @param _authorityHistoryPairFactory The authority and history factory
    /// @param _applicationFactory The application factory
    constructor(
        IAuthorityHistoryPairFactory _authorityHistoryPairFactory,
        CartesiDAppFactory _applicationFactory
    ) {
        authorityHistoryPairFactory = _authorityHistoryPairFactory;
        applicationFactory = _applicationFactory;
    }

    function newApplication(
        address _authorityOwner,
        address _dappOwner,
        bytes32 _templateHash,
        bytes32 _salt
    ) external returns (CartesiDApp) {
        (Authority authority, ) = authorityHistoryPairFactory
            .newAuthorityHistoryPair(_authorityOwner, _salt);
        return
            applicationFactory.newApplication(
                authority,
                _dappOwner,
                _templateHash,
                _salt
            );
    }

    function calculateApplicationAddress(
        address _authorityOwner,
        address _dappOwner,
        bytes32 _templateHash,
        bytes32 _salt
    ) external view returns (address, address, address) {
        (address authority, address history) = authorityHistoryPairFactory
            .calculateAuthorityHistoryAddressPair(_authorityOwner, _salt);
        address application = applicationFactory.calculateApplicationAddress(
            IConsensus(authority),
            _dappOwner,
            _templateHash,
            _salt
        );
        return (authority, history, application);
    }
}
