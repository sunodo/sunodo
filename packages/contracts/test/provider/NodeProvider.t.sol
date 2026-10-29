// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import {Authority} from "@cartesi/rollups/contracts/consensus/authority/Authority.sol";
import {CartesiDApp} from "@cartesi/rollups/contracts/dapp/CartesiDApp.sol";
import {CartesiDAppFactory} from "@cartesi/rollups/contracts/dapp/CartesiDAppFactory.sol";
import {ICartesiDApp} from "@cartesi/rollups/contracts/dapp/ICartesiDApp.sol";
import {ENS} from "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import {ADDR_REVERSE_NODE} from "@ensdomains/ens-contracts/contracts/reverseRegistrar/ReverseRegistrar.sol";
import {IReverseRegistrar} from "@ensdomains/ens-contracts/contracts/reverseRegistrar/IReverseRegistrar.sol";
import {Test} from "forge-std/Test.sol";

import {ReaderNodeProvider, ValidatorNodeProvider} from "../../src/provider/NodeProvider.sol";
import {ERC20Mock} from "../mocks/ERC20Mock.sol";

abstract contract NodeProviderTest is Test {
    uint256 constant PRICE = 10;
    uint256 constant START = 1_700_000_000;
    string constant LOCATION = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";

    event MachineLocation(address indexed application, string location);
    event FinancialRunway(address indexed application, uint256 until);

    address owner = makeAddr("owner");
    address payee = makeAddr("payee");
    address user = makeAddr("user");
    ENS ens = ENS(makeAddr("ens"));

    ERC20Mock token;

    function setUp() public virtual {
        vm.warp(START);
        token = new ERC20Mock();
    }

    function _expectSetName(string memory name) internal {
        address registrar = makeAddr("reverseRegistrar");
        vm.etch(address(ens), hex"00");
        vm.etch(registrar, hex"00");
        vm.mockCall(address(ens), abi.encodeCall(ENS.owner, (ADDR_REVERSE_NODE)), abi.encode(registrar));
        vm.mockCall(registrar, abi.encodeCall(IReverseRegistrar.setName, (name)), abi.encode(bytes32(0)));
        vm.expectCall(registrar, abi.encodeCall(IReverseRegistrar.setName, (name)));
    }
}

contract ReaderNodeProviderTest is NodeProviderTest {
    ReaderNodeProvider provider;

    function setUp() public override {
        super.setUp();
        provider = new ReaderNodeProvider(owner, ens, token, payee, PRICE);
    }

    function test_Constructor() public view {
        assertEq(provider.owner(), owner);
        assertEq(address(provider.ens()), address(ens));
        assertEq(address(provider.token()), address(token));
        assertEq(provider.payee(), payee);
        assertEq(provider.price(), PRICE);
    }

    function test_Register() public {
        ICartesiDApp application = ICartesiDApp(makeAddr("application"));

        vm.expectEmit(address(provider));
        emit MachineLocation(address(application), LOCATION);

        vm.prank(user);
        provider.register(application, LOCATION);
    }

    function test_SetName() public {
        _expectSetName("provider.eth");

        vm.prank(owner);
        provider.setName("provider.eth");
    }

    function test_RevertWhen_SetNameNotOwner() public {
        vm.expectRevert("Ownable: caller is not the owner");
        vm.prank(user);
        provider.setName("provider.eth");
    }
}

contract ValidatorNodeProviderTest is NodeProviderTest {
    bytes32 constant TEMPLATE_HASH = keccak256("template");
    bytes32 constant SALT = keccak256("salt");
    uint256 constant RUNWAY = 1 days;

    address applicationOwner = makeAddr("applicationOwner");

    CartesiDAppFactory factory;
    Authority consensus;
    ValidatorNodeProvider provider;

    function setUp() public override {
        super.setUp();
        factory = new CartesiDAppFactory();
        consensus = new Authority(makeAddr("authority"));
        provider = new ValidatorNodeProvider(owner, ens, token, payee, PRICE, factory, consensus);
    }

    function _fund(address account, uint256 time) internal {
        uint256 amount = provider.cost(time);
        token.mint(account, amount);
        vm.prank(account);
        token.approve(address(provider), amount);
    }

    function test_Constructor() public view {
        assertEq(provider.owner(), owner);
        assertEq(address(provider.factory()), address(factory));
        assertEq(address(provider.consensus()), address(consensus));
    }

    function test_CalculateApplicationAddress() public view {
        assertEq(
            provider.calculateApplicationAddress(applicationOwner, TEMPLATE_HASH, SALT),
            factory.calculateApplicationAddress(consensus, applicationOwner, TEMPLATE_HASH, SALT)
        );
    }

    function test_Deploy() public {
        _fund(user, RUNWAY);
        address expected = provider.calculateApplicationAddress(applicationOwner, TEMPLATE_HASH, SALT);

        vm.expectEmit(address(provider));
        emit MachineLocation(expected, LOCATION);
        vm.expectEmit(address(provider));
        emit FinancialRunway(expected, START + RUNWAY);

        vm.prank(user);
        CartesiDApp application = provider.deploy(applicationOwner, TEMPLATE_HASH, LOCATION, RUNWAY, SALT);

        assertEq(address(application), expected);
        assertEq(application.owner(), applicationOwner);
        assertEq(application.getTemplateHash(), TEMPLATE_HASH);
        assertEq(address(application.getConsensus()), address(consensus));
        assertEq(provider.runway(application), START + RUNWAY);
        assertEq(token.balanceOf(payee), provider.cost(RUNWAY));
    }

    function test_RevertWhen_DeployWhilePaused() public {
        _fund(user, RUNWAY);
        vm.prank(owner);
        provider.pause();

        vm.expectRevert("Pausable: paused");
        vm.prank(user);
        provider.deploy(applicationOwner, TEMPLATE_HASH, LOCATION, RUNWAY, SALT);
    }

    function test_Register() public {
        CartesiDApp application = factory.newApplication(consensus, applicationOwner, TEMPLATE_HASH);

        vm.expectEmit(address(provider));
        emit MachineLocation(address(application), LOCATION);

        vm.prank(user);
        provider.register(application, LOCATION);
    }

    function test_RevertWhen_RegisterWithWrongConsensus() public {
        Authority otherConsensus = new Authority(makeAddr("otherAuthority"));
        CartesiDApp application = factory.newApplication(otherConsensus, applicationOwner, TEMPLATE_HASH);

        vm.expectRevert("ValidatorNodeProvider: wrong consensus");
        provider.register(application, LOCATION);
    }

    function test_SetName() public {
        _expectSetName("validator.eth");

        vm.prank(owner);
        provider.setName("validator.eth");
    }
}
