const crypto = require("crypto");
const { getContract } = require("../blockchain/contract");
const {
  investigatorWallet,
  viewerWallet,
  judgeWallet, 
} = require("../blockchain/wallets");
const { uploadToIPFS } = require("../ipfs/ipfs.service");

/**
 * INVESTIGATOR
 * Upload evidence → IPFS → Blockchain
 * Case ID is derived from JWT (req.user)
 */
exports.uploadEvidence = async (req, res) => {
  try {
    const caseId = req.user.caseId; // 🔐 trusted source

    if (!req.file || !caseId) {
      return res.status(400).json({ message: "File required" });
    }

    const fileBuffer = req.file.buffer;

    // 🔐 Real hash (not hardcoded)
    const hash =
      "0x" + crypto.createHash("sha256").update(fileBuffer).digest("hex");

    const cid = await uploadToIPFS(fileBuffer);

    const contract = getContract(investigatorWallet);
    const tx = await contract.uploadEvidence(caseId, cid, hash);
    await tx.wait();

    res.status(200).json({
      success: true,
      message: "Evidence uploaded successfully",
      cid,
      hash,
      txHash: tx.hash,
    });
  } catch (err) {
    console.error("Upload evidence error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

/**
 * VIEWER / JUDGE
 * Access evidence → log on-chain → return CID
 * Case ID comes from JWT
 */
// controllers/evidenceController.js

exports.accessEvidence = async (req, res) => {
  try {
    const caseId = req.user.caseId; // 🔐 trusted from JWT middleware
    const index = Number(req.params.index);

    if (!caseId || index === undefined || isNaN(index)) {
      return res.status(400).json({ message: "Invalid params" });
    }

    const contract = getContract(viewerWallet); // ethers contract instance

    // 1️⃣ Fetch evidence details first (read-only)
    let evidence;
    try {
      evidence = await contract.getEvidence(caseId, index);
    } catch (err) {
      console.error("Evidence fetch failed:", err);
      return res.status(404).json({ message: "Evidence not found" });
    }

    const cid = evidence[0];
    const fileHash = evidence[1];
    const verified = evidence[2];
    const timestamp = Number(evidence[3]) * 1000;

    console.log(cid);

    // 2️⃣ Log the access only if evidence exists
    const tx = await contract.logEvidenceAccess(caseId, index);
    await tx.wait(); // wait for transaction confirmation

    res.status(200).json({
      success: true,
      cid,
      fileHash,
      verified,
      timestamp,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
    });
  } catch (err) {
    console.error("Access evidence error:", err);
    res.status(500).json({ message: "Access failed" });
  }
};



/**
 * JUDGE
 * Verify evidence integrity (NO IPFS UPLOAD)
 * Case ID comes from JWT
 */
exports.verifyEvidence = async (req, res) => {
  try {
    const caseId = req.user.caseId; // 🔐 trusted from JWT
    const { index } = req.body;

    if (!caseId || index === undefined || isNaN(index)) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const contract = getContract(judgeWallet);

    // 1️⃣ Fetch evidence from blockchain
    // Assuming getEvidence(caseId, index) returns:
    // [cid, fileHash, verified, timestamp]
    const evidence = await contract.getEvidence(caseId, index);

    if (!evidence) {
      return res.status(404).json({ message: "Evidence not found" });
    }

    const storedHash = evidence[1];
    const alreadyVerified = evidence[2];

    if (alreadyVerified) {
      return res.status(200).json({
        success : true,
        message: "Evidence already verified",
      });
    }

    // 2️⃣ Verify using stored hash
    const tx = await contract.verifyEvidence(caseId, index, storedHash);
    await tx.wait();

    res.status(200).json({
      success: true,
      message: "Evidence verified successfully",
      evidenceIndex: index,
      hash: storedHash,
      txHash: tx.hash,
    });
  } catch (err) {
    console.error("Verify evidence error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
};


exports.getEvidenceCount = async (req, res) => {
  try {
    const caseId = req.user.caseId;

    if (!caseId) {
      return res.status(400).json({ message: "Case ID missing in token" });
    }
    const contract = getContract(viewerWallet);
    const count = await contract.getEvidenceCount(caseId);

    res.json({
      caseId,
      count: Number(count),
    });
  } catch (err) {
    console.error("getEvidenceCount error:", err);
    res.status(500).json({ message: "Failed to fetch evidence count" });
  }
};

exports.getAuditTrail = async (req, res) => {
  try {
    const caseId = req.user.caseId;

    if (!caseId) {
      return res.status(400).json({ message: "Case ID missing in token" });
    }
    const contract = getContract(viewerWallet);
    const logs = await contract.getAccessLogs(caseId);

    const formattedLogs = logs.map((log) => ({
      performedBy: log.performedBy,
      timestamp: Number(log.timestamp) * 1000,
      action:
        Number(log.action) === 1
          ? "UPLOAD"
          : Number(log.action) === 2
          ? "VIEW"
          : Number(log.action) === 3
          ? "VERIFY"
          : "UNKNOWN",
    }));

    res.json(formattedLogs);
  } catch (err) {
    console.error("getAuditTrail error:", err);
    res.status(500).json({ message: "Failed to fetch audit trail" });
  }
};
