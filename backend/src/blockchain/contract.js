const { ethers } = require("ethers");
require("dotenv").config({ path: "../../.env" });

const contractArtifact = require("../../../blockchain/artifacts/contracts/EvidenceManager.sol/EvidenceManager.json");
const contractAddress = process.env.CONTRACT_ADDRESS;

function getContract(wallet) {
  return new ethers.Contract(contractAddress, contractArtifact.abi, wallet);
}

module.exports = { getContract };
