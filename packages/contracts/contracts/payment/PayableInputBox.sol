// SPDX-License-Identifier: Apache-2.0
/// @title PayableInputBox
pragma solidity ^0.8.13;

import {ICartesiDApp} from "@cartesi/rollups/contracts/dapp/ICartesiDApp.sol";
import {IInputBox} from "@cartesi/rollups/contracts/inputs/IInputBox.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract PayableInputBox is Ownable {
    IERC20 public token;
    address public authority;
    uint256 public pricePerInput;
    IInputBox public baseInputBox;

    constructor(
        address _token,
        address _authority,
        uint256 _pricePerInput,
        address _owner,
        IInputBox _baseInputBox
    ) Ownable() {
        token = IERC20(_token);
        authority = _authority;
        pricePerInput = _pricePerInput;
        baseInputBox = _baseInputBox;
        transferOwnership(_owner);
    }

    function addInput(
        address _dapp,
        bytes calldata _input
    ) public returns (bytes32) {
        require(
            token.transferFrom(msg.sender, authority, pricePerInput),
            "Payment failed"
        );
        return baseInputBox.addInput(_dapp, _input);
    }

    function changeAuthority(address newAuthority) public onlyOwner {
        authority = newAuthority;
    }

    function changePricePerInput(uint256 newPrice) public onlyOwner {
        pricePerInput = newPrice;
    }

    function changeBaseInputBox(address newBaseInputBox) public onlyOwner {
        baseInputBox = newBaseInputBox;
    }
}

contract PayableInputBoxFactory {
    function createPayableInputBox(
        IERC20 _token,
        address _authority,
        uint256 _pricePerInput,
        address _owner,
        IInputBox _baseInputBox
    ) public returns (address) {
        PayableInputBox newPayableInputBox = new PayableInputBox(
            _token,
            _authority,
            _pricePerInput,
            _owner,
            _baseInputBox
        );
        return address(newPayableInputBox);
    }
}
