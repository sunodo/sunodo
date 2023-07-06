// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import {Authority} from "@cartesi/rollups/contracts/consensus/authority/Authority.sol";
import {History} from "@cartesi/rollups/contracts/history/History.sol";
import {IInputBox} from "@cartesi/rollups/contracts/inputs/IInputBox.sol";

import {IAuthorityHistoryPairFactory} from "./IAuthorityHistoryPairFactory.sol";
import {IAuthorityFactory} from "./IAuthorityFactory.sol";
import {IHistoryFactory} from "./IHistoryFactory.sol";

/// @title Authority-History Pair Factory
/// @notice Allows anyone to reliably deploy a new Authority-History pair.
contract AuthorityHistoryPairFactory is IAuthorityHistoryPairFactory {
    IAuthorityFactory immutable authorityFactory;
    IHistoryFactory immutable historyFactory;

    /// @notice Constructs the factory.
    /// @param _authorityFactory The `Authority` factory
    /// @param _historyFactory The `History` factory
    constructor(
        IAuthorityFactory _authorityFactory,
        IHistoryFactory _historyFactory
    ) {
        authorityFactory = _authorityFactory;
        historyFactory = _historyFactory;

        emit AuthorityHistoryPairFactoryCreated(
            _authorityFactory,
            _historyFactory
        );
    }

    function getAuthorityFactory()
        external
        view
        override
        returns (IAuthorityFactory)
    {
        return authorityFactory;
    }

    function getHistoryFactory()
        external
        view
        override
        returns (IHistoryFactory)
    {
        return historyFactory;
    }

    function newAuthorityHistoryPair(
        address _authorityOwner
    ) external override returns (Authority authority_, History history_) {
        authority_ = authorityFactory.newAuthority(address(this));
        history_ = historyFactory.newHistory(address(authority_));

        authority_.setHistory(history_);
        authority_.transferOwnership(_authorityOwner);
    }

    function newAuthorityHistoryPair(
        address _authorityOwner,
        bytes32 _salt
    ) external override returns (Authority authority_, History history_) {
        authority_ = authorityFactory.newAuthority(address(this), _salt);
        history_ = historyFactory.newHistory(address(authority_), _salt);

        authority_.setHistory(history_);
        authority_.transferOwnership(_authorityOwner);
    }

    function calculateAuthorityHistoryAddressPair(
        bytes32 _salt
    )
        external
        view
        override
        returns (address authorityAddress_, address historyAddress_)
    {
        authorityAddress_ = authorityFactory.calculateAuthorityAddress(
            address(this),
            _salt
        );
        historyAddress_ = historyFactory.calculateHistoryAddress(
            authorityAddress_,
            _salt
        );
    }
}
