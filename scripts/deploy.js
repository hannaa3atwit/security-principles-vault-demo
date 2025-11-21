const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with:", deployer.address);

  const Vault = await ethers.getContractFactory("VulnerableVault", deployer);
  const vault = await Vault.deploy();
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("VulnerableVault deployed to:", vaultAddress);

  const Attacker = await ethers.getContractFactory("Attacker", deployer);
  const attacker = await Attacker.deploy(vaultAddress);
  await attacker.waitForDeployment();
  const attackerAddress = await attacker.getAddress();
  console.log("Attacker deployed to:", attackerAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
