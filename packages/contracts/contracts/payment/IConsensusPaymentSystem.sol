// SPDX-License-Identifier: MIT
/// @title Consensus Payment System
pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CartesiDApp} from "@cartesi/rollups/contracts/dapp/CartesiDApp.sol";
import {IConsensus} from "@cartesi/rollups/contracts/consensus/IConsensus.sol";

/// @title Consensus Payment System interface
/// @notice Manages the funding of DApps and payment of consensuses, using
///         an ERC-20 token as currency
interface IConsensusPaymentSystem {
    // Permissioned functions

    /// @notice Register a DApp
    /// @param _dapp the DApp
    /// @param _salary the amount of tokens the DApp pays to
    ///                its consensus every second, a.k.a. salary
    /// @param _funds the amount of tokens to be deposited into
    ///               the DApp's funds account
    /// @dev The DApp must not have been registered yet
    /// @dev This function can only be called by the DApp's owner
    /// @dev The salary must be greater than zero
    /// @dev This contract must have enough allowance to transfer
    ///      the funds from the caller's account
    function registerDApp(
        CartesiDApp _dapp,
        uint128 _salary,
        uint128 _funds
    ) external;

    /// @notice Withdraw tokens from a DApp's funds account
    ///         to the DApp's owner's account
    /// @param _dapp the DApp
    /// @param _amount the amount of tokens to be withdrawn
    /// @dev The DApp must be registered
    /// @dev This function can only be called by the DApp's owner
    /// @dev Updates the DApp's info before the withdrawal
    /// @dev The DApp must have enough funds for the withdrawal
    function withdrawFundsToDAppOwner(
        CartesiDApp _dapp,
        uint128 _amount
    ) external;

    /// @notice Update the amount of tokens a DApp pays
    ///         to its consensus every second, a.k.a. salary
    /// @param _dapp the DApp
    /// @param _salary the new salary
    /// @dev The DApp must be registered
    /// @dev This function can only be called by the DApp's owner
    /// @dev The salary must be greater than zero
    /// @dev Updates the DApp's info before the salary update
    function setDAppSalary(CartesiDApp _dapp, uint128 _salary) external;

    // Permissionless functions

    /// @notice Deposit tokens into a DApp's funds account
    /// @param _dapp the DApp
    /// @param _amount the amount of tokens to be deposited
    /// @dev The DApp must be registered
    /// @dev This contract must have enough allowance to transfer
    ///      the funds from the caller's account
    function depositFunds(CartesiDApp _dapp, uint128 _amount) external;

    /// @notice Update information regarding several DApps and withdraw
    ///         all tokens from a consensus' payment account
    /// @param _dapps the DApps to be updated
    /// @param _consensus the consensus
    /// @dev The DApps must be registered
    /// @dev The tokens are all transferred directly to the consensus
    function withdrawPaymentToConsensus(
        CartesiDApp[] calldata _dapps,
        IConsensus _consensus
    ) external;

    /// @notice Update information regarding a DApp
    /// @param _dapp the DApp
    /// @dev The DApp must be registered
    /// @dev Information include current consensus, funds, timestamp of
    ///      last payment, and consensus' payment account balance
    function updateDAppInfo(CartesiDApp _dapp) external;

    // View functions

    /// @notice Get the ERC-20 token used as currency
    /// @return The ERC-20 token
    function token() external view returns (IERC20);

    /// @notice Get the balance of a DApp's funds account
    /// @param _dapp The DApp
    /// @return The balance of the DApp's funds account
    /// @dev The DApp must be registered
    function getDAppFunds(CartesiDApp _dapp) external view returns (uint128);

    /// @notice Get the amount of tokens a DApp pays
    ///         to its consensus every second, a.k.a. salary
    /// @param _dapp The DApp
    /// @return The DApp's salary
    /// @dev The DApp must be registered
    function getDAppSalary(CartesiDApp _dapp) external view returns (uint128);

    /// @notice Get the timestamp of the last time the DApp and its consensus
    ///         were even in terms of payment, a.k.a. clock
    /// @param _dapp The DApp
    /// @return The DApp's clock
    /// @dev The DApp must be registered
    function getDAppClock(CartesiDApp _dapp) external view returns (uint96);

    /// @notice Get the last known consensus of a DApp
    /// @param _dapp The DApp
    /// @return The DApp's last known consensus
    /// @dev The DApp must be registered
    /// @dev This might not correspond to the current consensus
    function getDAppConsensus(
        CartesiDApp _dapp
    ) external view returns (IConsensus);

    /// @notice Get the balance of a consensus' payment account
    /// @param _consensus The consensus
    /// @return The balance of the consensus' payment account
    function getConsensusBalance(
        IConsensus _consensus
    ) external view returns (uint256);

    /// @notice Check whether a DApp has been registered or not
    /// @param _dapp The DApp
    /// @return Whether the DApp is registered
    function isDAppRegistered(CartesiDApp _dapp) external view returns (bool);
}
