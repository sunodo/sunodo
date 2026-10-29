// SPDX-License-Identifier: Apache-2.0
/// @title NodeProvider
pragma solidity ^0.8.30;

import {WithdrawalConfig} from "@cartesi/rollups/src/common/WithdrawalConfig.sol";
import {IConsensus} from "@cartesi/rollups/src/consensus/IConsensus.sol";
import {IApplication} from "@cartesi/rollups/src/dapp/IApplication.sol";
import {IApplicationFactory} from "@cartesi/rollups/src/dapp/IApplicationFactory.sol";
import {IInputBox} from "@cartesi/rollups/src/inputs/IInputBox.sol";
import {ENS} from "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import {IReverseRegistrar} from "@ensdomains/ens-contracts/contracts/reverseRegistrar/IReverseRegistrar.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IMachineProtocol} from "../protocol/IMachineProtocol.sol";
import {INodeProvider} from "./INodeProvider.sol";
import {IReaderNodeProvider} from "./INodeProvider.sol";
import {IValidatorNodeProvider} from "./INodeProvider.sol";
import {Vault} from "../payment/Vault.sol";

/// @dev namehash("addr.reverse"), as defined by ENS's ReverseRegistrar
bytes32 constant ADDR_REVERSE_NODE = 0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2;

abstract contract NodeProvider is INodeProvider, Vault {
    ENS public immutable ens;

    constructor(address _owner, ENS _ens, IERC20 _token, address _payee, uint256 _price)
        Vault(_owner, _token, _payee, _price)
    {
        ens = _ens;
    }

    function setName(string calldata name) external override onlyOwner {
        IReverseRegistrar ensReverseRegistrar = IReverseRegistrar(ens.owner(ADDR_REVERSE_NODE));

        // call the ENS reverse registrar to register name of address
        ensReverseRegistrar.setName(name);
    }
}

contract ReaderNodeProvider is NodeProvider, IReaderNodeProvider, IMachineProtocol {
    constructor(address _owner, ENS _ens, IERC20 _token, address _payee, uint256 _price)
        NodeProvider(_owner, _ens, _token, _payee, _price)
    {}

    function register(IApplication application, string calldata location) external {
        emit MachineLocation(address(application), location);
    }
}

contract ValidatorNodeProvider is NodeProvider, IMachineProtocol, IValidatorNodeProvider {
    IApplicationFactory public immutable factory;
    IConsensus public immutable consensus;
    IInputBox public immutable inputBox;

    constructor(
        address _owner,
        ENS _ens,
        IERC20 _token,
        address _payee,
        uint256 _price,
        IApplicationFactory _factory,
        IConsensus _consensus,
        IInputBox _inputBox
    ) NodeProvider(_owner, _ens, _token, _payee, _price) {
        factory = _factory;
        consensus = _consensus;
        inputBox = _inputBox;
    }

    function register(IApplication application, string calldata location) external {
        require(
            address(application.getOutputsMerkleRootValidator()) == address(consensus),
            "ValidatorNodeProvider: wrong consensus"
        );
        emit MachineLocation(address(application), location);
    }

    /// @dev This function deploys a new application deterministically, and registers it with the payment system
    function deploy(
        address _owner,
        bytes32 _templateHash,
        WithdrawalConfig calldata _withdrawalConfig,
        string calldata _location,
        uint256 _initialRunway,
        bytes32 _salt
    ) external override whenNotPaused returns (IApplication) {
        // delegate call to factory
        IApplication application =
            factory.newApplication(consensus, _owner, _templateHash, inputBox, _withdrawalConfig, _salt);

        // emit event with machine location
        emit MachineLocation(address(application), _location);

        // set initial runway
        _extendRunway(msg.sender, application, _initialRunway);

        return application;
    }

    /// @dev This function calculates the application deterministically
    function calculateApplicationAddress(
        address _owner,
        bytes32 _templateHash,
        WithdrawalConfig calldata _withdrawalConfig,
        bytes32 _salt
    ) external view returns (address) {
        return factory.calculateApplicationAddress(consensus, _owner, _templateHash, inputBox, _withdrawalConfig, _salt);
    }
}
