// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import {CartesiDAppFactory} from "@cartesi/rollups/contracts/dapp/CartesiDAppFactory.sol";
import {ENS} from "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import {Test} from "forge-std/Test.sol";

import {DeployScript} from "../../script/Deploy.s.sol";
import {Marketplace} from "../../src/marketplace/Marketplace.sol";

contract DeployScriptTest is Test {
    string constant ROLLUPS_DEPLOYMENTS = "dependencies/@cartesi-rollups-1.4.3/onchain/rollups/deployments/";

    DeployScript script;

    function setUp() public {
        script = new DeployScript();
        vm.etch(address(script.CARTESI_DAPP_FACTORY()), address(new CartesiDAppFactory()).code);
    }

    function test_Run() public {
        Marketplace marketplace = script.run();

        assertEq(address(marketplace), script.marketplaceAddress(ENS(address(0))));
        assertEq(address(marketplace.ens()), address(0));
        assertEq(address(marketplace.factory()), address(script.CARTESI_DAPP_FACTORY()));
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
        vm.etch(address(script.CARTESI_DAPP_FACTORY()), "");

        vm.expectRevert("DeployScript: CartesiDAppFactory not deployed on this chain");
        script.run();
    }

    function test_EnsRegistry() public view {
        assertEq(address(script.ensRegistry(1)), address(script.ENS_REGISTRY()));
        assertEq(address(script.ensRegistry(11155111)), address(script.ENS_REGISTRY()));
        assertEq(address(script.ensRegistry(8453)), address(0));
        assertEq(address(script.ensRegistry(42161)), address(0));
    }

    function test_FactoryMatchesRollupsDeployments() public view {
        string[8] memory networks = [
            "arbitrum", "arbitrum_sepolia", "base", "base_sepolia", "mainnet", "optimism", "optimism_sepolia", "sepolia"
        ];
        for (uint256 i; i < networks.length; ++i) {
            string memory json =
                vm.readFile(string.concat(ROLLUPS_DEPLOYMENTS, networks[i], "/CartesiDAppFactory.json"));
            assertEq(vm.parseJsonAddress(json, ".address"), address(script.CARTESI_DAPP_FACTORY()), networks[i]);
        }
    }
}
