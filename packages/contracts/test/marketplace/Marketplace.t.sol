// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.30;

import {IConsensus} from "@cartesi/rollups/src/consensus/IConsensus.sol";
import {Authority} from "@cartesi/rollups/src/consensus/authority/Authority.sol";
import {ApplicationFactory} from "@cartesi/rollups/src/dapp/ApplicationFactory.sol";
import {InputBox} from "@cartesi/rollups/src/inputs/InputBox.sol";
import {IRefundOutputBuilder} from "@cartesi/rollups/src/refund/IRefundOutputBuilder.sol";
import {ENS} from "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Test} from "forge-std/Test.sol";

import {Marketplace} from "../../src/marketplace/Marketplace.sol";
import {IReaderNodeProvider, IValidatorNodeProvider} from "../../src/provider/INodeProvider.sol";
import {ReaderNodeProvider, ValidatorNodeProvider} from "../../src/provider/NodeProvider.sol";
import {ERC20Mock} from "../mocks/ERC20Mock.sol";

contract MarketplaceTest is Test {
    uint256 constant PRICE = 10;

    event ValidatorNodeProviderCreated(
        IValidatorNodeProvider provider, IConsensus consensus, IERC20 token, address payee, uint256 price
    );

    event ReaderNodeProviderCreated(IReaderNodeProvider provider, IERC20 token, address payee, uint256 price);

    address providerOwner = makeAddr("providerOwner");
    address payee = makeAddr("payee");
    ENS ens = ENS(makeAddr("ens"));

    ApplicationFactory factory;
    Authority consensus;
    InputBox inputBox;
    ERC20Mock token;
    Marketplace marketplace;

    function setUp() public {
        factory = new ApplicationFactory(IRefundOutputBuilder(address(0)));
        consensus = new Authority(makeAddr("authority"), 720, 0);
        inputBox = new InputBox();
        token = new ERC20Mock();
        marketplace = new Marketplace(ens, factory, inputBox);
    }

    function _nextProviderAddress() internal view returns (address) {
        return vm.computeCreateAddress(address(marketplace), vm.getNonce(address(marketplace)));
    }

    function test_Constructor() public view {
        assertEq(address(marketplace.ens()), address(ens));
        assertEq(address(marketplace.factory()), address(factory));
        assertEq(address(marketplace.inputBox()), address(inputBox));
    }

    function test_NewValidatorNodeProvider() public {
        address expected = _nextProviderAddress();

        vm.expectEmit(address(marketplace));
        emit ValidatorNodeProviderCreated(IValidatorNodeProvider(expected), consensus, token, payee, PRICE);

        vm.prank(providerOwner);
        IValidatorNodeProvider created = marketplace.newValidatorNodeProvider(consensus, token, payee, PRICE);

        assertEq(address(created), expected);
        ValidatorNodeProvider provider = ValidatorNodeProvider(expected);
        assertEq(provider.owner(), providerOwner);
        assertEq(address(provider.ens()), address(ens));
        assertEq(address(provider.token()), address(token));
        assertEq(provider.payee(), payee);
        assertEq(provider.price(), PRICE);
        assertEq(address(provider.factory()), address(factory));
        assertEq(address(provider.consensus()), address(consensus));
        assertEq(address(provider.inputBox()), address(inputBox));
    }

    function test_NewReaderNodeProvider() public {
        address expected = _nextProviderAddress();

        vm.expectEmit(address(marketplace));
        emit ReaderNodeProviderCreated(IReaderNodeProvider(expected), token, payee, PRICE);

        vm.prank(providerOwner);
        IReaderNodeProvider created = marketplace.newReaderNodeProvider(token, payee, PRICE);

        assertEq(address(created), expected);
        ReaderNodeProvider provider = ReaderNodeProvider(expected);
        assertEq(provider.owner(), providerOwner);
        assertEq(address(provider.ens()), address(ens));
        assertEq(address(provider.token()), address(token));
        assertEq(provider.payee(), payee);
        assertEq(provider.price(), PRICE);
    }
}
