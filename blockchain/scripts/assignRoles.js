const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const deployer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, new ethers.JsonRpcProvider(process.env.RPC_URL));

  const EvidenceManager = await ethers.getContractFactory("EvidenceManager", deployer);
  const contract = await EvidenceManager.attach(contractAddress);

  // Replace with your 3 wallets
  const investigator = "0x23277e186e67A8e8255C11b2521AE2aD5Dc7Ef58";
  const viewer = "0xd4c26eb50406dd8BE9FBD75fCaaE90E99Cc997ad";
  const judge = "0x41BE84D2429ba03c9d4158e69775e11386504266";

  console.log("Assigning roles...");

  let tx = await contract.assignRole(investigator, 1); // INVESTIGATOR = 1
  await tx.wait();
  console.log("Investigator assigned");

  tx = await contract.assignRole(viewer, 2); // VIEWER = 2
  await tx.wait();
  console.log("Viewer assigned");

  tx = await contract.assignRole(judge, 3); // JUDGE = 3
  await tx.wait();
  console.log("Judge assigned");

  console.log("All roles assigned successfully ✅");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
