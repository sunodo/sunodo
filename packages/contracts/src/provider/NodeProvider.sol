// SPDX-License-Identifier: Apache-2.0
/// @title NodeProvider
pragma solidity ^0.8.20;

import {Application} from "@cartesi-rollups-contracts-2.0.0/dapp/Application.sol";
import {IApplication} from "@cartesi-rollups-contracts-2.0.0/dapp/IApplication.sol";
import {IApplicationFactory} from "@cartesi-rollups-contracts-2.0.0/dapp/IApplicationFactory.sol";
import {IOutputsMerkleRootValidator} from "@cartesi-rollups-contracts-2.0.0/consensus/IOutputsMerkleRootValidator.sol";
import {IERC20} from "@openzeppelin-contracts-5.2.0/token/ERC20/IERC20.sol";

import {IMachineProtocol} from "../protocol/IMachineProtocol.sol";
import {INodeProvider} from "./INodeProvider.sol";
import {IReaderNodeProvider} from "./INodeProvider.sol";
import {IValidatorNodeProvider} from "./INodeProvider.sol";
import {Vault} from "../payment/Vault.sol";

contract ReaderNodeProvider is Vault, IReaderNodeProvider, IMachineProtocol {
    constructor(
        address _owner,
        IERC20 _token,
        address _payee,
        uint256 _price
    ) Vault(_owner, _token, _payee, _price) {}

    function register(
        IApplication application,
        string calldata location
    ) external {
        emit MachineLocation(address(application), location);
    }
}

contract ValidatorNodeProvider is
    Vault,
    IMachineProtocol,
    IValidatorNodeProvider
{
    IApplicationFactory public immutable factory;
    IOutputsMerkleRootValidator public immutable validator;

    constructor(
        address _owner,
        IERC20 _token,
        address _payee,
        uint256 _price,
        IApplicationFactory _factory,
        IOutputsMerkleRootValidator _validator
    ) Vault(_owner, _token, _payee, _price) {
        factory = _factory;
        validator = _validator;
    }

    function register(
        IApplication application,
        string calldata location
    ) external {
        require(
            application.getOutputsMerkleRootValidator() == validator,
            "ValidatorNodeProvider: wrong validator"
        );
        emit MachineLocation(address(application), location);
    }

    /// @dev This function deploys a new application deterministically, and registers it with the payment system
    function deploy(
        address _owner,
        bytes32 _templateHash,
        bytes calldata _dataAvailability,
        string calldata _location,
        uint256 _initialRunway,
        bytes32 _salt
    ) external override whenNotPaused returns (IApplication) {
        // delegate call to factory
        IApplication application = factory.newApplication(
            validator,
            _owner,
            _templateHash,
            _dataAvailability,
            _salt
        );

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
        bytes calldata _dataAvailability,
        bytes32 _salt
    ) external view returns (address) {
        return
            factory.calculateApplicationAddress(
                validator,
                _owner,
                _templateHash,
                _dataAvailability,
                _salt
            );
    }
}
