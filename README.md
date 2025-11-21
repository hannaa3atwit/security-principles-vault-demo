This project demonstrates a very simple and intentionally vulnerable Ethereum smart contract.
The purpose of the project is to show how flawed withdraw logic can allow an attacker to drain funds that do not belong to them.
This is for academic demonstration only and must never be used in a real wallet or deployed on mainnet.

Project Overview
There are two contracts in this project.

VulnerableVault.sol
This contract allows anyone to deposit ETH.
The withdraw function is intentionally insecure.
The contract does not track individual user balances. It only checks if the vault has enough ETH overall.
Because of this, anyone can call withdraw and take out any amount of ETH, even if they never deposited anything.

Attacker.sol
This contract is used to exploit the vault.
It points to the VulnerableVault and calls withdraw on it.
Since the vault does not verify ownership of deposits, the attacker contract is able to drain funds that other users deposited.

Repository Structure
contracts
VulnerableVault.sol
Attacker.sol
scripts
deploy.js
demo.js
hardhat.config.js
package.json
.env.example
README.md

Setup Instructions

Install Node.js and npm

Install project dependencies

npm install


Create a .env file in the project root. Add the following values:

ALCHEMY_API_KEY=your_alchemy_key_here
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_key_here


Do not commit the .env file to GitHub.

Running the Local Demo
The project includes a local Hardhat script that demonstrates the exploit without using real networks.

Start a local Hardhat network:

npx hardhat node


In another terminal:

npm run demo:local


The script will deploy both contracts, simulate a deposit, run the attack, and print the vault and attacker balances before and after.

Deploying to Sepolia Testnet
Use the command below to deploy the contracts to the Sepolia Ethereum test network.

npm run deploy:sepolia


This will output the deployed vault address and attacker address.

Verifying the Contracts on Etherscan
After deployment, you can verify them on Etherscan so that the Read and Write tabs appear.

Verify the vault:

npx hardhat verify --network sepolia <vaultAddress>


Verify the attacker:

npx hardhat verify --network sepolia <attackerAddress> <vaultAddress>


Manual Sepolia Exploit Demonstration
Once contracts are verified on Etherscan, you can perform the exploit manually for your class presentation.

Step One
Open the vault contract on Etherscan
Go to the Contract tab
Go to Write Contract
Connect MetaMask
Call deposit and send an amount of test ETH, for example 0.5 ETH
Confirm the transaction
You will now see the vault balance contain the deposited ETH

Step Two
Open the attacker contract on Etherscan
Go to Write Contract
Connect MetaMask
Find the function attack
Enter the same deposited amount in wei
For example, 0.5 ETH is 500000000000000000
Submit the transaction
The attacker contract will call withdraw on the vault

Step Three
Refresh the vault contract page
The vault balance will now be zero
Refresh the attacker contract page
The attacker contract will now hold the stolen ETH
This confirms the vulnerability

Disclaimer
This project is intentionally insecure and is only for educational demonstration.
It must never be used in production and must never be deployed on any network containing real assets.
