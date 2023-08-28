// SPDX-License-Identifier: Apache-2.0
/// @title Marketplace
pragma solidity ^0.8.13;

import {ICartesiDAppFactory} from "@cartesi/rollups/contracts/dapp/ICartesiDAppFactory.sol";
import {IConsensus} from "@cartesi/rollups/contracts/consensus/IConsensus.sol";
import {PaymentSplitter} from "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import {ENS} from "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IMarketplace} from "./IMarketplace.sol";
import {IReaderNodeProvider, IValidatorNodeProvider} from "../provider/INodeProvider.sol";
import {IVault} from "../payment/IVault.sol";
import {ReaderNodeProvider, ValidatorNodeProvider} from "../provider/NodeProvider.sol";
import {Vault} from "../payment/Vault.sol";

/// @notice Factory for creating new ERC20 based providers
contract Marketplace is IMarketplace {
    uint256 public immutable totalShares;
    uint256 public immutable marketplaceShares;
    address public immutable payee;

    ENS public immutable ens;
    ICartesiDAppFactory public immutable factory;

    constructor(
        ENS _ens,
        ICartesiDAppFactory _factory,
        uint256 _totalShares,
        uint256 _marketplaceShares,
        address _payee
    ) {
        ens = _ens;
        factory = _factory;

        totalShares = _totalShares;
        marketplaceShares = _marketplaceShares;
        payee = _payee;
    }

    /// @notice Create a new ERC20 based ValidatorNodeProvider using the specified token
    function newValidatorNodeProvider(
        IConsensus _consensus,
        IERC20 _token,
        address _payee,
        uint256 _price
    ) external returns (IValidatorNodeProvider) {
        address owner = msg.sender;

        // create a vault using PaymentSplitter
        PaymentSplitter vault = _createPaymentSplitter(_payee);

        // create factory using that token
        ValidatorNodeProvider provider = new ValidatorNodeProvider(
            owner,
            ens,
            _token,
            address(vault),
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

        // create a vault using PaymentSplitter
        PaymentSplitter vault = _createPaymentSplitter(_payee);

        // create provider using that token
        IReaderNodeProvider provider = new ReaderNodeProvider(
            owner,
            ens,
            _token,
            address(vault),
            _price
        );

        // emit event
        emit ReaderNodeProviderCreated(provider, _token, _payee, _price);

        return provider;
    }

    function _createPaymentSplitter(
        address _factoryPayee
    ) internal returns (PaymentSplitter) {
        address[] memory payees = new address[](2);
        payees[0] = payee;
        payees[1] = _factoryPayee;
        uint256[] memory shares = new uint256[](2);
        shares[0] = marketplaceShares;
        shares[1] = totalShares - marketplaceShares;
        return new PaymentSplitter(payees, shares);
    }
}
