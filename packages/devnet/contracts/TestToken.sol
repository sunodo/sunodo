// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/manager/AccessManaged.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract TestToken is
    ERC20,
    ERC20Burnable,
    ERC20Pausable,
    AccessManaged,
    ERC20Permit
{
    constructor(
        address initialAuthority
    )
        ERC20("TestToken", "TEST")
        AccessManaged(initialAuthority)
        ERC20Permit("TestToken")
    {
        _mint(initialAuthority, 1000000000 * 10 ** decimals());
    }

    function pause() public restricted {
        _pause();
    }

    function unpause() public restricted {
        _unpause();
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
}
