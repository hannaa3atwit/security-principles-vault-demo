// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title VulnerableVault
/// @notice Intentionally insecure vault for educational purposes only.
///         Do NOT deploy this to mainnet.
contract VulnerableVault {
    /// @notice Anyone can deposit ETH into the vault.
    function deposit() external payable {
        // BUG: We do not record who deposited or how much.
        //      The contract only tracks the total ETH balance implicitly.
    }

    /// @notice Intentionally vulnerable withdraw function.
    /// @dev Vulnerability:
    ///      - No check that msg.sender has ever deposited.
    ///      - Only requirement: the vault currently holds enough ETH.
    ///      => Any attacker can withdraw other users' deposits.
    function withdraw(uint256 amount) external {
        require(address(this).balance >= amount, "Not enough ETH in vault");

        // Send ETH directly to whoever calls this function.
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "ETH transfer failed");
    }

    /// @notice Helper to read how much ETH is in the vault.
    function getVaultBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
