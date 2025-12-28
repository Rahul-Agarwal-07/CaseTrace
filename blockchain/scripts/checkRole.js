const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

  // 👇 Address you want to check
  const addressToCheck = "0x23277e186e67A8e8255C11b2521AE2aD5Dc7Ef58";

  if (!addressToCheck) {
    throw new Error("❌ Please provide an address: npx hardhat run scripts/checkRole.js --network mumbai <address>");
  }

  const EvidenceManager = await hre.ethers.getContractAt(
    "EvidenceManager",
    CONTRACT_ADDRESS
  );

  const role = await EvidenceManager.roles(addressToCheck);

  const roleMap = {
    0: "NONE",
    1: "INVESTIGATOR",
    2: "VIEWER",
    3: "JUDGE"
  };

  console.log("🔍 Address:", addressToCheck);
  console.log("🧑 Role code:", role.toString());
  console.log("🏷️ Role name:", roleMap[role.toString()] || "UNKNOWN");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
//0x45c2ffcb4b2b88b8ad61bf8da6bd4147323505d5b9c94f9f0a9bb5a2305eda3b