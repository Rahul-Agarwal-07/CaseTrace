const { ethers } = require("ethers");
const provider = require("./provider");
require("dotenv").config();
const { deployerWallet, investigatorWallet, viewerWallet, judgeWallet } = require("./wallets");

const contractABI = require("../../blockchain/artifacts/contracts/EvidenceManager.sol/EvidenceManager.json").abi;
const contractAddress = process.env.CONTRACT_ADDRESS;

// Connecting contract to a specific wallet
function getContract(wallet) {
  return new ethers.Contract(contractAddress, contractABI, wallet);
}

module.exports = {
  getContract,
  deployerWallet,
  investigatorWallet,
  viewerWallet,
  judgeWallet
};
