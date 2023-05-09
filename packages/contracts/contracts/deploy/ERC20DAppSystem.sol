// SPDX-License-Identifier: MIT
/// @title Sunodo DApp Factory Factory
pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ICartesiIPFSDAppFactory} from "../factory/ICartesiIPFSDAppFactory.sol";
import {IERC20DAppSystem} from "./IERC20DAppSystem.sol";
import {IPayableDAppFactory} from "./IPayableDAppFactory.sol";
import {ERC20DAppFactory} from "./ERC20DAppFactory.sol";

/// @notice Factory for creating new ERC20 based DApp factories
contract ERC20DAppSystem is IERC20DAppSystem {
    ICartesiIPFSDAppFactory public immutable factory;

    constructor(ICartesiIPFSDAppFactory _factory) {
        factory = _factory;
    }

    /// @notice Create a new ERC20 based DApp factory using the specified token
    function newERC20DAppFactory(
        IERC20 _token
    ) external returns (ERC20DAppFactory) {
        // create factory using that token
        ERC20DAppFactory erc20Factory = new ERC20DAppFactory(factory, _token);

        // emit event
        emit ERC20DAppFactoryCreated(erc20Factory, _token);

        return erc20Factory;
    }
}
