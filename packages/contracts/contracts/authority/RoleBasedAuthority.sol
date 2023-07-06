// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IConsensus} from "@cartesi/rollups/contracts/consensus/IConsensus.sol";
import {Authority} from "@cartesi/rollups/contracts/consensus/authority/Authority.sol";
import {IInputBox} from "@cartesi/rollups/contracts/inputs/IInputBox.sol";
import {IHistory} from "@cartesi/rollups/contracts/history/IHistory.sol";

/// @notice IConsensus implementation which delegates to an Authority contract and provides AccessControl
/// @dev This enables to shift the ownership of the Authority from tipically an EOA of a validator node
/// to this smart contract. This contract provides AccessControl, with two roles in addition to the
/// DEFAULT_ADMIN_ROLE: the VALIDATOR_ROLE, which can submit claims, and the COLLECTOR_ROLE, which can collect
/// rewards for the validation job
contract RoleBasedAuthority is AccessControl, IConsensus {
    /// Create a new role identifier for the collector role, they can collect deposited ERC-20
    bytes32 public constant COLLECTOR_ROLE = keccak256("COLLECTOR_ROLE");

    /// Create a new role identifier for the validator role, they can submit claims
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");

    /// The Authority contract which will be delegated to
    Authority public immutable authority;

    /// @notice Create a new RoleBasedAuthority
    /// @param _owner The address that will be the ADMIN of this contract
    /// @param _inputBox The input box used by the Authority
    constructor(address _owner, IInputBox _inputBox) {
        authority = new Authority(address(this), _inputBox);
        _grantRole(DEFAULT_ADMIN_ROLE, _owner);
    }

    /// @notice Submits a claim to the Authority
    /// @dev This function can only be called by a validator
    function submitClaim(
        bytes calldata _claimData
    ) external onlyRole(VALIDATOR_ROLE) {
        authority.submitClaim(_claimData);
    }

    /// @notice Transfer ownership over the current history contract to `_consensus`
    /// @dev This function can only be called by an admin
    function migrateHistoryToConsensus(
        address _consensus
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        authority.migrateHistoryToConsensus(_consensus);
    }

    /// @notice Make `Authority` point to another history contract
    /// @dev This function can only be called by the admin
    function setHistory(
        IHistory _history
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        authority.setHistory(_history);
    }

    /// @notice Withdraw ERC-20 tokens from the Authority
    /// @dev This function can only be called by a collector
    function withdrawERC20Tokens(
        IERC20 _token,
        address _recipient,
        uint256 _amount
    ) external onlyRole(COLLECTOR_ROLE) {
        authority.withdrawERC20Tokens(_token, _recipient, _amount);
    }

    /// @notice Get a claim from the Authority
    function getClaim(
        address _dapp,
        bytes calldata _proofContext
    )
        public
        view
        override
        returns (
            bytes32 epochHash_,
            uint256 firstInputIndex_,
            uint256 lastInputIndex_
        )
    {
        return authority.getClaim(_dapp, _proofContext);
    }

    function join() public override {
        return authority.join();
    }
}
