// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import {Authority} from "@cartesi/rollups/contracts/consensus/authority/Authority.sol";
import {IInputBox} from "@cartesi/rollups/contracts/inputs/IInputBox.sol";
import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";

import {IAuthorityFactory} from "./IAuthorityFactory.sol";

/// @title Authority Factory
/// @notice Allows anyone to reliably deploy a new `Authority` contract.
contract AuthorityFactory is IAuthorityFactory {
    IInputBox public immutable inputBox;

    constructor(IInputBox _inputBox) {
        inputBox = _inputBox;
    }

    function newAuthority(
        address _authorityOwner
    ) external override returns (Authority) {
        Authority authority = new Authority(_authorityOwner, inputBox);

        emit AuthorityCreated(_authorityOwner, inputBox, authority);

        return authority;
    }

    function newAuthority(
        address _authorityOwner,
        bytes32 _salt
    ) external override returns (Authority) {
        Authority authority = new Authority{salt: _salt}(
            _authorityOwner,
            inputBox
        );

        emit AuthorityCreated(_authorityOwner, inputBox, authority);

        return authority;
    }

    function calculateAuthorityAddress(
        address _authorityOwner,
        bytes32 _salt
    ) external view override returns (address) {
        return
            Create2.computeAddress(
                _salt,
                keccak256(
                    abi.encodePacked(
                        type(Authority).creationCode,
                        abi.encode(_authorityOwner, inputBox)
                    )
                )
            );
    }
}
