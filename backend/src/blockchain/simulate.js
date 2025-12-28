require("dotenv").config({ path: "../../.env" });
const { ethers } = require("ethers");
const { investigatorWallet } = require("./wallets"); // adjust if path is different

async function main() {
  // Connect to Mumbai RPC
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  // Connect wallet to provider
  const wallet = investigatorWallet.connect(provider);

  // Use the compiled artifact ABI
  const contractArtifact = require("../../../blockchain/artifacts/contracts/EvidenceManager.sol/EvidenceManager.json");
  const contractABI = contractArtifact.abi;

  const contractAddress = process.env.CONTRACT_ADDRESS; // deployed EvidenceManager
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

 


  // Check role
  try {
    const role = await contract.roles(wallet.address);
    console.log("Wallet role code:", role.toString());
  } catch (err) {
    console.error("Error checking role:", err);
    return;
  }

  // Simulate uploadEvidence
  const caseId = "CASE123";
  const cid = "QmTestCid1234567890abcdef";

  // bytes32 hash (32 bytes = 64 hex chars + 0x)
  const fileHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

  try {
    await contract.uploadEvidence(caseId, cid, fileHash);
    console.log("✅ Simulation success: uploadEvidence would work.");
  } catch (err) {
    console.error("❌ Simulation failed:", err.reason || err);
  }
}

main();
