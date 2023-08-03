// SPDX-License-Identifier: Apache-2.0
/// @title ERC20 Payment System factory
pragma solidity ^0.8.13;

import {IConsensus} from "@cartesi/rollups/contracts/consensus/IConsensus.sol";
import {ICartesiDAppFactory} from "@cartesi/rollups/contracts/dapp/ICartesiDAppFactory.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IPayableDAppFactory} from "./IPayableDAppFactory.sol";

/// @notice Interface for creating new ERC20 based DApp factories
interface IPayableDAppSystem {
    /// @notice A new factory was created
    /// @param factory The address of the factory
    /// @param token The token used for billing
    /// @param consensus The consensus associated with the factory
    /// @param price The price per minute of dapp node execution
    event PayableDAppFactoryCreated(
        IPayableDAppFactory factory,
        IERC20 token,
        IConsensus consensus,
        uint256 price
    );

    /// @notice Create a new ERC20 based DApp factory using the specified token
    function newPayableDAppFactory(
        IERC20 _token,
        IConsensus consensus,
        uint256 _price
    ) external returns (IPayableDAppFactory);
}
