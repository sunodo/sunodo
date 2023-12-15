// SPDX-License-Identifier: Apache-2.0
/// @title NodeProvider
pragma solidity ^0.8.13;

import {CartesiDApp} from "@cartesi/rollups/contracts/dapp/CartesiDApp.sol";
import {ICartesiDApp} from "@cartesi/rollups/contracts/dapp/ICartesiDApp.sol";
import {ICartesiDAppFactory} from "@cartesi/rollups/contracts/dapp/ICartesiDAppFactory.sol";
import {IConsensus} from "@cartesi/rollups/contracts/consensus/IConsensus.sol";
import {ENS} from "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import {ADDR_REVERSE_NODE} from "@ensdomains/ens-contracts/contracts/reverseRegistrar/ReverseRegistrar.sol";
import {IReverseRegistrar} from "@ensdomains/ens-contracts/contracts/reverseRegistrar/IReverseRegistrar.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IMachineProtocol} from "../protocol/IMachineProtocol.sol";
import {INodeProvider} from "./INodeProvider.sol";
import {IReaderNodeProvider} from "./INodeProvider.sol";
import {IValidatorNodeProvider} from "./INodeProvider.sol";
import {Vault} from "../payment/Vault.sol";

abstract contract NodeProvider is INodeProvider, Vault {
    ENS public immutable ens;

    constructor(
        address _owner,
        ENS _ens,
        IERC20 _token,
        address _payee,
        uint256 _price
    ) Vault(_owner, _token, _payee, _price) {
        ens = _ens;
    }

    function setName(string calldata name) external override onlyOwner {
        IReverseRegistrar ensReverseRegistrar = IReverseRegistrar(
            ens.owner(ADDR_REVERSE_NODE)
        );

        // call the ENS reverse registrar to register name of address
        ensReverseRegistrar.setName(name);
    }
}

contract ReaderNodeProvider is
    NodeProvider,
    IReaderNodeProvider,
    IMachineProtocol
{
    constructor(
        address _owner,
        ENS _ens,
        IERC20 _token,
        address _payee,
        uint256 _price
    ) NodeProvider(_owner, _ens, _token, _payee, _price) {}

    function register(
        ICartesiDApp application,
        string calldata location
    ) external {
        emit MachineLocation(address(application), location);
    }
}

contract ValidatorNodeProvider is
    NodeProvider,
    IMachineProtocol,
    IValidatorNodeProvider
{
    ICartesiDAppFactory public immutable factory;
    IConsensus public immutable consensus;

    constructor(
        address _owner,
        ENS _ens,
        IERC20 _token,
        address _payee,
        uint256 _price,
        ICartesiDAppFactory _factory,
        IConsensus _consensus
    ) NodeProvider(_owner, _ens, _token, _payee, _price) {
        factory = _factory;
        consensus = _consensus;
    }

    function register(
        ICartesiDApp application,
        string calldata location
    ) external {
        require(
            application.getConsensus() == consensus,
            "ValidatorNodeProvider: wrong consensus"
        );
        emit MachineLocation(address(application), location);
    }

    /// @dev This function deploys a new application, and registers it with the payment system
    function deploy(
        address _owner,
        bytes32 _templateHash,
        string calldata _location,
        uint256 _initialRunway
    ) external override whenNotPaused returns (CartesiDApp) {
        // delegate call to factory
        CartesiDApp application = factory.newApplication(
            consensus,
            _owner,
            _templateHash
        );

        // emit event with machine location
        emit MachineLocation(address(application), _location);

        // set initial runway
        _extendRunway(msg.sender, application, _initialRunway);

        return application;
    }
}
