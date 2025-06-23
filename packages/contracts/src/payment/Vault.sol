// SPDX-License-Identifier: Apache-2.0
/// @title Vault
pragma solidity ^0.8.20;

import {IApplication} from "@cartesi-rollups-contracts-2.0.0/dapp/IApplication.sol";
import {IERC20} from "@openzeppelin-contracts-5.2.0/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin-contracts-5.2.0/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin-contracts-5.2.0/access/Ownable.sol";
import {Pausable} from "@openzeppelin-contracts-5.2.0/utils/Pausable.sol";

import {IFinancialProtocol} from "../protocol/IFinancialProtocol.sol";
import {IVault} from "./IVault.sol";

/// @notice This contract implements an IVault, using an ERC-20 token and a fixed price per unit of time.
contract Vault is IVault, IFinancialProtocol, Ownable, Pausable {
    using SafeERC20 for IERC20;
    uint256 public immutable price;
    IERC20 public immutable token;
    address public immutable payee;

    mapping(IApplication => uint256) public runway;

    /// @notice Construct a new Vault with the given token as payment method and price
    /// @param _owner The owner of the vault, who can pause its operation
    /// @param _token The token to use as payment method
    /// @param _payee The receiver of the payments to applications managed by this vault
    /// @param _price The price per second of execution of the application node
    constructor(
        address _owner,
        IERC20 _token,
        address _payee,
        uint256 _price
    ) Ownable(_owner) {
        token = _token;
        payee = _payee;
        price = _price;
    }

    function cost(uint256 _time) public view returns (uint256) {
        return _time * price;
    }

    function extendRunway(
        IApplication _application,
        uint256 _time
    ) external override whenNotPaused returns (uint256) {
        return _extendRunway(msg.sender, _application, _time);
    }

    function _extendRunway(
        address _msgSender,
        IApplication _application,
        uint256 _time
    ) internal returns (uint256) {
        // calculate the token cost of the runway time
        uint256 _cost = cost(_time);

        // transfer tokens from sender to payee
        token.safeTransferFrom(_msgSender, payee, _cost);

        uint256 currentRunway = runway[_application];

        // if runway was in the past, reset to now
        if (currentRunway < block.timestamp) {
            currentRunway = block.timestamp;
        }

        // update application runway
        uint256 newRunway = currentRunway + _time;
        runway[_application] = newRunway;

        // emit event so offchain gets notified
        emit FinancialRunway(address(_application), newRunway);

        return newRunway;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
