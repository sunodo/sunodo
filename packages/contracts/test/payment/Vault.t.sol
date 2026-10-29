// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import {ICartesiDApp} from "@cartesi/rollups/contracts/dapp/ICartesiDApp.sol";
import {Test} from "forge-std/Test.sol";

import {Vault} from "../../src/payment/Vault.sol";
import {ERC20Mock} from "../mocks/ERC20Mock.sol";

contract VaultTest is Test {
    uint256 constant PRICE = 10;
    uint256 constant START = 1_700_000_000;

    event FinancialRunway(address indexed application, uint256 until);

    address owner = makeAddr("owner");
    address payee = makeAddr("payee");
    address user = makeAddr("user");
    ICartesiDApp application = ICartesiDApp(makeAddr("application"));

    ERC20Mock token;
    Vault vault;

    function setUp() public {
        vm.warp(START);
        token = new ERC20Mock();
        vault = new Vault(owner, token, payee, PRICE);
    }

    function _fund(address account, uint256 time) internal {
        uint256 amount = vault.cost(time);
        token.mint(account, amount);
        vm.prank(account);
        token.approve(address(vault), amount);
    }

    function test_Constructor() public view {
        assertEq(vault.owner(), owner);
        assertEq(address(vault.token()), address(token));
        assertEq(vault.payee(), payee);
        assertEq(vault.price(), PRICE);
        assertFalse(vault.paused());
    }

    function testFuzz_Cost(uint128 time) public view {
        assertEq(vault.cost(time), uint256(time) * PRICE);
    }

    function test_ExtendRunway() public {
        _fund(user, 100);

        vm.expectEmit(address(vault));
        emit FinancialRunway(address(application), START + 100);

        vm.prank(user);
        uint256 until = vault.extendRunway(application, 100);

        assertEq(until, START + 100);
        assertEq(vault.runway(application), START + 100);
        assertEq(token.balanceOf(user), 0);
        assertEq(token.balanceOf(payee), vault.cost(100));
    }

    function test_ExtendRunway_AccumulatesWhileActive() public {
        _fund(user, 200);

        vm.startPrank(user);
        vault.extendRunway(application, 100);
        vm.warp(START + 50);
        uint256 until = vault.extendRunway(application, 100);
        vm.stopPrank();

        assertEq(until, START + 200);
    }

    function test_ExtendRunway_RestartsWhenExpired() public {
        _fund(user, 200);

        vm.startPrank(user);
        vault.extendRunway(application, 100);
        vm.warp(START + 150);
        uint256 until = vault.extendRunway(application, 100);
        vm.stopPrank();

        assertEq(until, START + 250);
    }

    function test_RevertWhen_ExtendRunwayWithoutAllowance() public {
        token.mint(user, vault.cost(100));

        vm.expectRevert("ERC20: insufficient allowance");
        vm.prank(user);
        vault.extendRunway(application, 100);
    }

    function test_RevertWhen_ExtendRunwayWhilePaused() public {
        _fund(user, 100);
        vm.prank(owner);
        vault.pause();

        vm.expectRevert("Pausable: paused");
        vm.prank(user);
        vault.extendRunway(application, 100);
    }

    function test_Unpause() public {
        _fund(user, 100);
        vm.startPrank(owner);
        vault.pause();
        vault.unpause();
        vm.stopPrank();

        vm.prank(user);
        vault.extendRunway(application, 100);
        assertEq(vault.runway(application), START + 100);
    }

    function test_RevertWhen_PauseNotOwner() public {
        vm.expectRevert("Ownable: caller is not the owner");
        vm.prank(user);
        vault.pause();
    }

    function test_RevertWhen_UnpauseNotOwner() public {
        vm.prank(owner);
        vault.pause();

        vm.expectRevert("Ownable: caller is not the owner");
        vm.prank(user);
        vault.unpause();
    }
}
