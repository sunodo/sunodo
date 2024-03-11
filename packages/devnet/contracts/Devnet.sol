// SPDX-License-Identifier: Apache-2.0
/// @title Devnet
pragma solidity ^0.8.13;

import {IConsensus} from "@cartesi/rollups/contracts/consensus/IConsensus.sol";
import {Authority} from "@cartesi/rollups/contracts/consensus/authority/Authority.sol";
import {History} from "@cartesi/rollups/contracts/history/History.sol";
import {IAuthorityHistoryPairFactory} from "@cartesi/rollups/contracts/consensus/authority/IAuthorityHistoryPairFactory.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IMarketplace} from "@sunodo/contracts/contracts/marketplace/IMarketplace.sol";
import {IValidatorNodeProvider} from "@sunodo/contracts/contracts/provider/INodeProvider.sol";

contract Devnet {
    IValidatorNodeProvider public immutable provider;
    Authority public immutable authority;
    History public immutable history;

    constructor(
        IAuthorityHistoryPairFactory _factory,
        IMarketplace _marketplace,
        IERC20 _token
    ) {
        address owner = msg.sender;
        bytes32 salt = 0;

        // instantiate authority
        (authority, history) = _factory.newAuthorityHistoryPair(owner, salt);

        address payee = msg.sender;
        uint256 price = 1000000000000000000;

        provider = _marketplace.newValidatorNodeProvider(
            authority,
            _token,
            payee,
            price
        );
    }
}
