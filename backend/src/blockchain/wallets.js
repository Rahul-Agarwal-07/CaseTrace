const { ethers } = require("ethers");
const provider = require("./provider");
require("dotenv").config({ path: "../../.env" });

// Deployer / admin wallet
const deployerWallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

// Role wallets
const investigatorWallet = new ethers.Wallet(process.env.INVESTIGATOR_PRIVATE_KEY, provider);
const viewerWallet = new ethers.Wallet(process.env.VIEWER_PRIVATE_KEY, provider);
const judgeWallet = new ethers.Wallet(process.env.JUDGE_PRIVATE_KEY, provider);

module.exports = {
  deployerWallet,
  investigatorWallet,
  viewerWallet,
  judgeWallet
};
