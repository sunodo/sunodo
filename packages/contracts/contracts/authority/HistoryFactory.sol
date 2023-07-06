// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import {History} from "@cartesi/rollups/contracts/history/History.sol";
import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";

import {IHistoryFactory} from "./IHistoryFactory.sol";

/// @title History Factory
/// @notice Allows anyone to reliably deploy a new `History` contract.
contract HistoryFactory is IHistoryFactory {
    function newHistory(
        address _historyOwner
    ) external override returns (History) {
        History history = new History(_historyOwner);

        emit HistoryCreated(_historyOwner, history);

        return history;
    }

    function newHistory(
        address _historyOwner,
        bytes32 _salt
    ) external override returns (History) {
        History history = new History{salt: _salt}(_historyOwner);

        emit HistoryCreated(_historyOwner, history);

        return history;
    }

    function calculateHistoryAddress(
        address _historyOwner,
        bytes32 _salt
    ) external view override returns (address) {
        return
            Create2.computeAddress(
                _salt,
                keccak256(
                    abi.encodePacked(
                        type(History).creationCode,
                        abi.encode(_historyOwner)
                    )
                )
            );
    }
}
