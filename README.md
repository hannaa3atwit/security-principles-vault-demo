# Vulnerable Smart Contract Demo

This project shows a very simple and intentionally vulnerable Ethereum smart contract.  
It demonstrates how flawed withdraw logic allows an attacker to drain funds they did not deposit.  
This is for academic use only and must never be deployed on mainnet.


## Overview

There are two contracts:

VulnerableVault.sol  
A basic ETH vault with a deposit function.  
The withdraw function is insecure because the contract does not track individual balances.  
Anyone can withdraw any amount as long as the vault has enough ETH.

Attacker.sol  
A contract that calls the vulnerable withdraw function to steal ETH from the vault.


## How to Run Locally

Install dependencies:

npm install

Start a local Hardhat network:

npx hardhat node

Run the demo script:

npm run demo:local

This will deploy the contracts, simulate a deposit, run the attack, and print balances before and after.

## Deploying to Sepolia

Add your keys to a .env file (not included in the repo):


ALCHEMY_API_KEY=your_key
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_key

Deploy:

npm run deploy:sepolia

## Sepolia Demo (Manual)

1. Open the vault contract on Etherscan  
   Use the Write Contract tab to call deposit and send test ETH.

2. Open the attacker contract  
   Use the Write Contract tab to call attack with the same amount (in wei).

3. Refresh both pages  
   The vault balance will drop to zero.  
   The attacker contract will now hold the funds.


## Disclaimer

This project is intentionally insecure and only for educational demonstration.  
It must not be used in production.
