// SPDX-License-Identifier: Apache-2.0
/// @title Consensus Payment System
/// @dev Assumes block.timestamp <= type(uint96).max

pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ICartesiDApp} from "@cartesi/rollups/contracts/dapp/ICartesiDApp.sol";
import {CartesiDApp} from "@cartesi/rollups/contracts/dapp/CartesiDApp.sol";
import {IConsensus} from "@cartesi/rollups/contracts/consensus/IConsensus.sol";
import {IFinancialProtocol} from "../protocol/IFinancialProtocol.sol";
import {IConsensusPaymentSystem} from "./IConsensusPaymentSystem.sol";

contract ConsensusPaymentSystem is IConsensusPaymentSystem, IFinancialProtocol {
    /// @notice Information about a specific DApp
    /// @param funds tokens reserved for paying consensus
    /// @param salary tokens to be paid to consensus per second
    /// @param clock time of last payment
    /// @param consensus current consensus (might be outdated)
    struct DAppInfo {
        uint128 funds;
        uint128 salary;
        uint96 clock;
        IConsensus consensus;
    }

    IERC20 public immutable token;
    mapping(ICartesiDApp => DAppInfo) dappInfos;
    mapping(IConsensus => uint256) consensusBalances;

    /* CONSTRUCTOR */

    constructor(IERC20 _token) {
        token = _token;
    }

    /* EXTERNAL FUNCTIONS */

    function registerDApp(
        CartesiDApp _dapp,
        uint128 _salary,
        uint128 _funds
    ) external override onlyDAppOwner(_dapp) {
        require(_salary > 0, "CPS: Salary cannot be 0");
        require(
            token.transferFrom(msg.sender, address(this), _funds),
            "CPS: Failed token transfer"
        );
        IConsensus consensus = _dapp.getConsensus();
        require(!isDAppRegistered(_dapp), "CPS: DApp is already registered");
        dappInfos[_dapp] = DAppInfo({
            funds: _funds,
            salary: _salary,
            clock: uint96(block.timestamp),
            consensus: consensus
        });
    }

    function depositFunds(
        CartesiDApp _dapp,
        uint128 _amount
    ) external override onlyRegisteredDApp(_dapp) {
        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "CPS: Failed token transfer"
        );
        dappInfos[_dapp].funds += _amount;
    }

    function withdrawPaymentToConsensus(
        CartesiDApp[] calldata _dapps,
        IConsensus _consensus
    ) external override {
        for (uint256 i; i < _dapps.length; ++i) {
            updateDAppInfo(_dapps[i]);
        }
        uint256 amount = consensusBalances[_consensus];
        consensusBalances[_consensus] = 0;
        require(
            token.transfer(address(_consensus), amount),
            "CPS: Failed token transfer"
        );
    }

    function updateDAppInfo(
        CartesiDApp _dapp
    ) public override onlyRegisteredDApp(_dapp) {
        _updateDAppInfo(_dapp, 0);
    }

    function withdrawFundsToDAppOwner(
        CartesiDApp _dapp,
        uint128 _amount
    ) external override onlyRegisteredDApp(_dapp) onlyDAppOwner(_dapp) {
        _updateDAppInfo(_dapp, 0);
        uint128 funds = dappInfos[_dapp].funds;
        require(funds >= _amount, "CPS: Not enough funds");
        unchecked {
            dappInfos[_dapp].funds = funds - _amount;
        }
        require(
            token.transfer(msg.sender, _amount),
            "CPS: Failed token transfer"
        );
    }

    function setDAppSalary(
        CartesiDApp _dapp,
        uint128 _salary
    ) external override onlyRegisteredDApp(_dapp) onlyDAppOwner(_dapp) {
        require(_salary > 0, "CPS: Salary cannot be 0");
        _updateDAppInfo(_dapp, _salary);
    }

    function getDAppFunds(
        CartesiDApp _dapp
    ) external view override returns (uint128) {
        return dappInfos[_dapp].funds;
    }

    function getDAppSalary(
        CartesiDApp _dapp
    ) external view override returns (uint128) {
        return dappInfos[_dapp].salary;
    }

    function getDAppClock(
        CartesiDApp _dapp
    ) external view override returns (uint96) {
        return dappInfos[_dapp].clock;
    }

    function getDAppConsensus(
        CartesiDApp _dapp
    ) external view override returns (IConsensus) {
        return dappInfos[_dapp].consensus;
    }

    function getConsensusBalance(
        IConsensus _consensus
    ) external view override returns (uint256) {
        return consensusBalances[_consensus];
    }

    function isDAppRegistered(
        CartesiDApp _dapp
    ) public view override returns (bool) {
        return dappInfos[_dapp].salary > 0;
    }

    /* MODIFIERS */

    modifier onlyDAppOwner(CartesiDApp _dapp) {
        require(msg.sender == _dapp.owner(), "CPS: Not DApp owner");
        _;
    }

    modifier onlyRegisteredDApp(CartesiDApp _dapp) {
        require(isDAppRegistered(_dapp), "CPS: Unregistered DApp");
        _;
    }

    /* INTERNAL FUNCTIONS */

    // Assumes _dapp is registered
    // If _newSalary is 0, uses current salary
    function _updateDAppInfo(ICartesiDApp _dapp, uint128 _newSalary) internal {
        IConsensus newConsensus = _dapp.getConsensus();

        DAppInfo memory dappInfo = dappInfos[_dapp];

        uint96 timedelta = uint96(block.timestamp) - dappInfo.clock;
        uint256 payment = timedelta * uint256(dappInfo.salary);

        if (payment > dappInfo.funds) {
            timedelta = uint96(dappInfo.funds / dappInfo.salary);
            payment = timedelta * uint256(dappInfo.salary);
        }

        consensusBalances[dappInfo.consensus] += payment;

        // TODO: implement IFinancialProtocol

        dappInfos[_dapp] = DAppInfo({
            funds: dappInfo.funds - uint128(payment),
            salary: _newSalary > 0 ? _newSalary : dappInfo.salary,
            clock: dappInfo.clock + timedelta,
            consensus: newConsensus
        });
    }
}
