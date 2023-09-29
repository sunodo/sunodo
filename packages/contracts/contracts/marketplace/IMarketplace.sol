// SPDX-License-Identifier: Apache-2.0
/// @title ERC20 Payment System factory
pragma solidity ^0.8.13;

import {IConsensus} from "@cartesi/rollups/contracts/consensus/IConsensus.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IReaderNodeProvider, IValidatorNodeProvider} from "../provider/INodeProvider.sol";

/// @notice Interface for creating new ERC20 based DApp factories
interface IMarketplace {
    /// @notice A new factory was created
    /// @param provider The address of the provider
    /// @param consensus The consensus associated with the factory
    /// @param token The token used for billing
    /// @param payee The address that will receive the payments
    /// @param price The price per minute of dapp node execution
    event ValidatorNodeProviderCreated(
        IValidatorNodeProvider provider,
        IConsensus consensus,
        IERC20 token,
        address payee,
        uint256 price
    );

    /// @notice A new provider was created
    /// @param provider The address of the provider
    /// @param token The token used for billing
    /// @param payee The address that will receive the payments
    /// @param price The price per minute of dapp node execution
    event ReaderNodeProviderCreated(
        IReaderNodeProvider provider,
        IERC20 token,
        address payee,
        uint256 price
    );

    /// @notice Create a new ERC20 based Validator Node Provider using the specified token
    /// @param consensus The consensus associated with the factory
    /// @param token The token used for billing
    /// @param payee The address that will receive the payments
    /// @param price The price per second of application node execution
    function newValidatorNodeProvider(
        IConsensus consensus,
        IERC20 token,
        address payee,
        uint256 price
    ) external returns (IValidatorNodeProvider);

    /// @notice Create a new ERC20 based Reader Node Provider using the specified token
    /// @param token The token used for billing
    /// @param payee The address that will receive the payments
    /// @param price The price per second of application node execution
    function newReaderNodeProvider(
        IERC20 token,
        address payee,
        uint256 price
    ) external returns (IReaderNodeProvider);
}
