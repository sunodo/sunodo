// SPDX-License-Identifier: Apache-2.0
/// @title Sunodo DApp Factory Factory
pragma solidity ^0.8.13;

import {IConsensus} from "@cartesi/rollups/contracts/consensus/IConsensus.sol";
import {ICartesiDAppFactory} from "@cartesi/rollups/contracts/dapp/ICartesiDAppFactory.sol";
import {ENS} from "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IPayableDAppSystem} from "./IPayableDAppSystem.sol";
import {IPayableDAppFactory} from "./IPayableDAppFactory.sol";
import {PayableDAppFactory} from "./PayableDAppFactory.sol";

/// @notice Factory for creating new ERC20 based DApp factories
contract PayableDAppSystem is IPayableDAppSystem {
    ENS public immutable ens;
    ICartesiDAppFactory public immutable factory;

    constructor(ENS _ens, ICartesiDAppFactory _factory) {
        ens = _ens;
        factory = _factory;
    }

    /// @notice Create a new ERC20 based DApp factory using the specified token
    function newPayableDAppFactory(
        IERC20 _token,
        address _payee,
        IConsensus _consensus,
        uint256 _price
    ) external returns (IPayableDAppFactory) {
        // create factory using that token
        PayableDAppFactory payableFactory = new PayableDAppFactory(
            msg.sender,
            ens,
            _payee,
            factory,
            _token,
            _consensus,
            _price
        );

        // emit event
        emit PayableDAppFactoryCreated(
            payableFactory,
            _token,
            _payee,
            _consensus,
            _price
        );

        return payableFactory;
    }
}
