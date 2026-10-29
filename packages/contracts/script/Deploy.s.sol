// SPDX-License-Identifier: Apache-2.0
/// @title Deployment script
pragma solidity ^0.8.13;

import {ICartesiDAppFactory} from "@cartesi/rollups/contracts/dapp/ICartesiDAppFactory.sol";
import {ENS} from "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import {Script, console} from "forge-std/Script.sol";

import {Marketplace} from "../src/marketplace/Marketplace.sol";

/// @notice Deploys the Marketplace deterministically through the CREATE2 deployer
/// @dev Usage: forge script script/Deploy.s.sol --rpc-url <network> --account <keystore> --broadcast --verify
contract DeployScript is Script {
    /// @notice The CartesiDAppFactory of @cartesi/rollups 1.4,
    /// deployed at the same address on every supported network
    ICartesiDAppFactory public constant CARTESI_DAPP_FACTORY =
        ICartesiDAppFactory(0x7122cd1221C20892234186facfE8615e6743Ab02);

    /// @notice The ENS registry, deployed at the same address on mainnet and sepolia
    ENS public constant ENS_REGISTRY = ENS(0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e);

    bytes32 public constant SALT = bytes32(0);

    function run() external returns (Marketplace) {
        ENS ens = ensRegistry(block.chainid);
        address expected = marketplaceAddress(ens);

        if (expected.code.length > 0) {
            console.log("Marketplace already deployed at", expected);
            return Marketplace(expected);
        }

        require(
            address(CARTESI_DAPP_FACTORY).code.length > 0, "DeployScript: CartesiDAppFactory not deployed on this chain"
        );

        vm.startBroadcast();
        Marketplace marketplace = new Marketplace{salt: SALT}(ens, CARTESI_DAPP_FACTORY);
        vm.stopBroadcast();

        console.log("Marketplace deployed at", address(marketplace));
        return marketplace;
    }

    /// @notice The ENS registry of a chain, or the zero address where ENS is not available
    function ensRegistry(uint256 chainId) public pure returns (ENS) {
        if (chainId == 1 || chainId == 11155111) {
            return ENS_REGISTRY;
        }
        return ENS(address(0));
    }

    /// @notice The address the Marketplace is deployed to for a given ENS registry
    function marketplaceAddress(ENS ens) public pure returns (address) {
        bytes memory initCode = abi.encodePacked(type(Marketplace).creationCode, abi.encode(ens, CARTESI_DAPP_FACTORY));
        return vm.computeCreate2Address(SALT, keccak256(initCode));
    }
}
