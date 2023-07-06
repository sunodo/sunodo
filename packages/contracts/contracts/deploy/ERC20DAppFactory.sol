// SPDX-License-Identifier: Apache-2.0
/// @title ERC20 DApp Factory
pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IConsensus} from "@cartesi/rollups/contracts/consensus/IConsensus.sol";
import {CartesiDApp} from "@cartesi/rollups/contracts/dapp/CartesiDApp.sol";
import {ICartesiIPFSDAppFactory} from "../factory/ICartesiIPFSDAppFactory.sol";
import {IConsensusPaymentSystem} from "../payment/IConsensusPaymentSystem.sol";
import {ConsensusPaymentSystem} from "../payment/ConsensusPaymentSystem.sol";
import {IPayableDAppFactory} from "./IPayableDAppFactory.sol";

/// @notice This contract implements an IPayableDAppFactory based on a IERC20 token
/// @dev This contract is a proxy to a ICartesiIPFSDAppFactory, and it registers the dapp
/// to a ConsensusPaymentSystem managed by the specified token
contract ERC20DAppFactory is IPayableDAppFactory {
    ICartesiIPFSDAppFactory public immutable factory;
    IConsensusPaymentSystem public immutable paymentSystem;

    /// @notice Construct a new ERC20DAppFactory with the given token as payment method
    constructor(ICartesiIPFSDAppFactory _factory, IERC20 _token) {
        factory = _factory;
        paymentSystem = new ConsensusPaymentSystem(_token);
    }

    /// @dev This function deploys a new application, and registers it with the payment system
    function newApplication(
        IConsensus _consensus,
        address _dappOwner,
        bytes32 _templateHash,
        string memory _cid,
        uint128 _salary,
        uint128 _funds
    ) external override returns (CartesiDApp) {
        // delegate call to factory, owner must be this contract, so we can register with payment system
        CartesiDApp dapp = factory.newApplication(
            _consensus,
            address(this),
            _templateHash,
            _cid
        );

        // register with payment system with given salary and funds
        paymentSystem.registerDApp(dapp, _salary, _funds);

        // now we transfer ownership to the given owner
        dapp.transferOwnership(_dappOwner);

        // return application
        return dapp;
    }
}
