// SPDX-License-Identifier: Apache-2.0
/// @title Marketplace
pragma solidity ^0.8.20;

import {IApplicationFactory} from "@cartesi-rollups-contracts-2.0.0/dapp/IApplicationFactory.sol";
import {IConsensus} from "@cartesi-rollups-contracts-2.0.0/consensus/IConsensus.sol";
import {IERC20} from "@openzeppelin-contracts-5.2.0/token/ERC20/IERC20.sol";

import {IMarketplace} from "./IMarketplace.sol";
import {IReaderNodeProvider, IValidatorNodeProvider} from "../provider/INodeProvider.sol";
import {IVault} from "../payment/IVault.sol";
import {ReaderNodeProvider, ValidatorNodeProvider} from "../provider/NodeProvider.sol";
import {Vault} from "../payment/Vault.sol";

/// @notice Factory for creating new ERC20 based providers
contract Marketplace is IMarketplace {
    IApplicationFactory public immutable factory;

    constructor(IApplicationFactory _factory) {
        factory = _factory;
    }

    /// @notice Create a new ERC20 based ValidatorNodeProvider using the specified token
    function newValidatorNodeProvider(
        IConsensus _consensus,
        IERC20 _token,
        address _payee,
        uint256 _price
    ) external returns (IValidatorNodeProvider) {
        address owner = msg.sender;

        // create factory using that token
        ValidatorNodeProvider provider = new ValidatorNodeProvider(
            owner,
            _token,
            _payee,
            _price,
            factory,
            _consensus
        );

        // emit event
        emit ValidatorNodeProviderCreated(
            provider,
            _consensus,
            _token,
            _payee,
            _price
        );

        return provider;
    }

    /// @notice Create a new ERC20 based ReaderNodeProvider using the specified token
    function newReaderNodeProvider(
        IERC20 _token,
        address _payee,
        uint256 _price
    ) external returns (IReaderNodeProvider) {
        address owner = msg.sender;

        // create provider using that token
        IReaderNodeProvider provider = new ReaderNodeProvider(
            owner,
            _token,
            _payee,
            _price
        );

        // emit event
        emit ReaderNodeProviderCreated(provider, _token, _payee, _price);

        return provider;
    }
}
