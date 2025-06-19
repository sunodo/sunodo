// SPDX-License-Identifier: Apache-2.0
/// @title Marketplace interface
pragma solidity ^0.8.20;

import {IConsensus} from "@cartesi-rollups-contracts-2.0.0/consensus/IConsensus.sol";
import {IERC20} from "@openzeppelin-contracts-5.2.0/token/ERC20/IERC20.sol";

import {IReaderNodeProvider, IValidatorNodeProvider} from "../provider/INodeProvider.sol";

/// @notice Interface for creating new ERC20 based node provider
interface IMarketplace {
    /// @notice A new provider was created
    /// @param provider The address of the provider
    /// @param consensus The consensus associated with the provider
    /// @param token The token used for billing
    /// @param payee The address that will receive the payments
    /// @param price The price per second of application node execution
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
    /// @param price The price per second of application node execution
    event ReaderNodeProviderCreated(
        IReaderNodeProvider provider,
        IERC20 token,
        address payee,
        uint256 price
    );

    /// @notice Create a new ERC20 based ValidatorNodeProvider using the specified token
    /// @param consensus The consensus associated with the provider
    /// @param token The token used for billing
    /// @param payee The address that will receive the payments
    /// @param price The price per second of application node execution
    function newValidatorNodeProvider(
        IConsensus consensus,
        IERC20 token,
        address payee,
        uint256 price
    ) external returns (IValidatorNodeProvider);

    /// @notice Create a new ERC20 based ReaderNodeProvider using the specified token
    /// @param token The token used for billing
    /// @param payee The address that will receive the payments
    /// @param price The price per second of application node execution
    function newReaderNodeProvider(
        IERC20 token,
        address payee,
        uint256 price
    ) external returns (IReaderNodeProvider);
}
