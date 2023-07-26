// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import {Authority} from "@cartesi/rollups/contracts/consensus/authority/Authority.sol";
import {History} from "@cartesi/rollups/contracts/history/History.sol";
import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";

import {IAuthorityFactory} from "./IAuthorityFactory.sol";

/// @title Authority-History Pair Factory
/// @notice Allows anyone to reliably deploy a new Authority-History pair.
contract AuthorityFactory is IAuthorityFactory {
    function newAuthority(
        address _authorityOwner
    ) public override returns (Authority) {
        Authority authority = new Authority(address(this));
        History history = new History(address(authority));
        authority.setHistory(history);
        authority.transferOwnership(_authorityOwner);

        emit AuthorityCreated(authority);

        return authority;
    }

    function newAuthority() external override returns (Authority) {
        return newAuthority(msg.sender);
    }

    function newAuthority(
        address _authorityOwner,
        bytes32 _salt
    ) public override returns (Authority) {
        _salt = calculateSalt(_authorityOwner, _salt);
        Authority authority = new Authority{salt: _salt}(address(this));
        History history = new History{salt: _salt}(address(authority));
        authority.setHistory(history);
        authority.transferOwnership(_authorityOwner);

        emit AuthorityCreated(authority);

        return authority;
    }

    function newAuthority(bytes32 _salt) external override returns (Authority) {
        return newAuthority(msg.sender, _salt);
    }

    function calculateAuthorityAddress(
        address _authorityOwner,
        bytes32 _salt
    ) external view override returns (address) {
        _salt = calculateSalt(_authorityOwner, _salt);
        return
            Create2.computeAddress(
                _salt,
                keccak256(
                    abi.encodePacked(
                        type(Authority).creationCode,
                        abi.encode(_authorityOwner)
                    )
                )
            );
    }

    function calculateSalt(
        address _authorityOwner,
        bytes32 _salt
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_authorityOwner, _salt));
    }
}
