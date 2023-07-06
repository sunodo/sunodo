// SPDX-License-Identifier: Apache-2.0
/// @title ERC20 Payment System factory
pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ICartesiIPFSDAppFactory} from "../factory/ICartesiIPFSDAppFactory.sol";
import {ERC20DAppFactory} from "./ERC20DAppFactory.sol";

/// @notice Interface for creating new ERC20 based DApp factories
interface IERC20DAppSystem {
    /// @notice A new factory was created
    /// @param factory The address of the factory
    /// @param token The token used for billing
    event ERC20DAppFactoryCreated(ERC20DAppFactory factory, IERC20 token);

    /// @notice Create a new ERC20 based DApp factory using the specified token
    function newERC20DAppFactory(
        IERC20 _token
    ) external returns (ERC20DAppFactory);
}
