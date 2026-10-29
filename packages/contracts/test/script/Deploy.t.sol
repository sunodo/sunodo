// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.30;

import {ApplicationFactory} from "@cartesi/rollups/src/dapp/ApplicationFactory.sol";
import {InputBox} from "@cartesi/rollups/src/inputs/InputBox.sol";
import {IRefundOutputBuilder} from "@cartesi/rollups/src/refund/IRefundOutputBuilder.sol";
import {ENS} from "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import {Test} from "forge-std/Test.sol";

import {DeployScript} from "../../script/Deploy.s.sol";
import {Marketplace} from "../../src/marketplace/Marketplace.sol";

contract DeployScriptTest is Test {
    DeployScript script;

    function setUp() public {
        script = new DeployScript();
        vm.etch(
            address(script.APPLICATION_FACTORY()),
            address(new ApplicationFactory(IRefundOutputBuilder(address(0)))).code
        );
        vm.etch(address(script.INPUT_BOX()), address(new InputBox()).code);
    }

    function test_Run() public {
        Marketplace marketplace = script.run();

        assertEq(address(marketplace), script.marketplaceAddress(ENS(address(0))));
        assertEq(address(marketplace.ens()), address(0));
        assertEq(address(marketplace.factory()), address(script.APPLICATION_FACTORY()));
        assertEq(address(marketplace.inputBox()), address(script.INPUT_BOX()));
    }

    function test_Run_UsesENSOnMainnet() public {
        vm.chainId(1);
        Marketplace marketplace = script.run();

        assertEq(address(marketplace.ens()), address(script.ENS_REGISTRY()));
        assertEq(address(marketplace), script.marketplaceAddress(script.ENS_REGISTRY()));
    }

    function test_Run_IsIdempotent() public {
        Marketplace first = script.run();
        Marketplace second = script.run();

        assertEq(address(first), address(second));
    }

    function test_RevertWhen_FactoryNotDeployed() public {
        vm.etch(address(script.APPLICATION_FACTORY()), "");

        vm.expectRevert("DeployScript: ApplicationFactory not deployed on this chain");
        script.run();
    }

    function test_RevertWhen_InputBoxNotDeployed() public {
        vm.etch(address(script.INPUT_BOX()), "");

        vm.expectRevert("DeployScript: InputBox not deployed on this chain");
        script.run();
    }

    function test_EnsRegistry() public view {
        assertEq(address(script.ensRegistry(1)), address(script.ENS_REGISTRY()));
        assertEq(address(script.ensRegistry(11155111)), address(script.ENS_REGISTRY()));
        assertEq(address(script.ensRegistry(8453)), address(0));
        assertEq(address(script.ensRegistry(42161)), address(0));
    }
}
