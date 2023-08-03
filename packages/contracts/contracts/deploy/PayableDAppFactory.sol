// SPDX-License-Identifier: Apache-2.0
/// @title ERC20 DApp Factory
pragma solidity ^0.8.13;

import {IConsensus} from "@cartesi/rollups/contracts/consensus/IConsensus.sol";
import {CartesiDApp} from "@cartesi/rollups/contracts/dapp/CartesiDApp.sol";
import {ICartesiDApp} from "@cartesi/rollups/contracts/dapp/ICartesiDApp.sol";
import {ICartesiDAppFactory} from "@cartesi/rollups/contracts/dapp/ICartesiDAppFactory.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";

import {IFinancialProtocol} from "../protocol/IFinancialProtocol.sol";
import {IMachineProtocol} from "../protocol/IMachineProtocol.sol";
import {IPayableDAppFactory} from "./IPayableDAppFactory.sol";

/// @notice This contract implements an IPayableDAppFactory based on a IERC20 token
contract PayableDAppFactory is
    IPayableDAppFactory,
    IFinancialProtocol,
    IMachineProtocol,
    Ownable,
    Pausable
{
    ICartesiDAppFactory public immutable factory;
    IERC20 public immutable token;
    IConsensus public immutable consensus;
    uint256 public immutable price;

    mapping(ICartesiDApp => uint256) public runway;

    /// @notice Construct a new ERC20DAppFactory with the given token as payment method
    /// @param _factory The factory to delegate calls to instantiate the dapp
    /// @param _consensus The consensus contract to use
    /// @param _price The price per second of execution of the dapp node
    constructor(
        address _owner,
        ICartesiDAppFactory _factory,
        IERC20 _token,
        IConsensus _consensus,
        uint256 _price
    ) {
        factory = _factory;
        token = _token;
        consensus = _consensus;
        price = _price;

        // transfer ownership to the give owner
        transferOwnership(_owner);
    }

    /// @dev This function deploys a new application, and registers it with the payment system
    function newApplication(
        address _dappOwner,
        bytes32 _templateHash,
        string memory _cid,
        uint256 _runway
    ) external override whenNotPaused returns (CartesiDApp) {
        // delegate call to factory
        CartesiDApp dapp = factory.newApplication(
            consensus,
            _dappOwner,
            _templateHash
        );

        // emit event to bind CID to application
        emit MachineLocation(address(dapp), _cid);

        // set initial runway
        _extendRunway(msg.sender, dapp, _runway);

        // return application
        return dapp;
    }

    function importApplication(
        CartesiDApp _dapp,
        string memory _cid,
        uint256 _runway
    ) external override whenNotPaused {
        require(
            _dapp.getConsensus() == this.consensus(),
            "PaymentDAppFactory: cannot import dapp with a different consensus"
        );

        require(
            _dapp.owner() == msg.sender,
            "PaymentDAppFactory: only owner can import application"
        );

        // emit location event, as DApp was not intantiated by this factory
        emit MachineLocation(address(_dapp), _cid);

        // extend runway
        _extendRunway(msg.sender, _dapp, _runway);
    }

    function cost(uint256 _time) public view returns (uint256) {
        return _time * price;
    }

    function extendRunway(
        ICartesiDApp _dapp,
        uint256 _time
    ) external override whenNotPaused returns (uint256) {
        return _extendRunway(msg.sender, _dapp, _time);
    }

    function _extendRunway(
        address _msgSender,
        ICartesiDApp _dapp,
        uint256 _time
    ) internal returns (uint256) {
        // calculate the token cost of the runway time
        uint256 _cost = cost(_time);

        // transfer tokens from sender to this contract
        require(
            token.transferFrom(_msgSender, address(this), _cost),
            "PaymentDAppFactory: failed to transfer tokens"
        );

        uint256 currentRunway = runway[_dapp];

        // if runway was in the past, update to now
        currentRunway = currentRunway < block.timestamp
            ? block.timestamp
            : currentRunway;

        // update dapp runway
        uint256 newRunway = currentRunway + _time;
        runway[_dapp] = newRunway;

        // emit event so offchain gets notified
        emit FinancialRunway(address(_dapp), newRunway);

        return newRunway;
    }

    function withdraw() external onlyOwner {
        require(
            token.transfer(msg.sender, token.balanceOf(address(this))),
            "PaymentDAppFactory: failed to withdraw tokens"
        );
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
