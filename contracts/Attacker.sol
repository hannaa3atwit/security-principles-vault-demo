// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./VulnerableVault.sol";

contract Attacker {
    VulnerableVault public vault;

    constructor(address _vault) {
        vault = VulnerableVault(_vault);
    }

    receive() external payable {}

    function attack(uint256 amount) external {
        vault.withdraw(amount);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
