const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const {
  uploadEvidence,
  accessEvidence,
  verifyEvidence,
  getEvidenceCount,
  getAuditTrail
} = require("../controllers/evidence.controller");

const { requireAuth } = require("../middlewares/auth.middleware");

/**
 * INVESTIGATOR
 * Upload evidence
 * caseId is taken from req.user.caseId
 */
router.post(
  "/upload",
  requireAuth(["INVESTIGATOR"]),
  upload.single("file"),
  uploadEvidence
);

/**
 * VIEWER / JUDGE
 * Access evidence by index
 * caseId is taken from req.user.caseId
 */
router.get(
  "/access/:index",
  requireAuth(["VIEWER", "JUDGE"]),
  accessEvidence
);

/**
 * JUDGE
 * Verify evidence
 * caseId is taken from req.user.caseId
 */
router.post(
  "/verify",
  requireAuth(["JUDGE"]),
  verifyEvidence
);

router.get("/count", requireAuth(["INVESTIGATOR","VIEWER","JUDGE"]), getEvidenceCount);
router.get("/audit", requireAuth(["INVESTIGATOR","VIEWER","JUDGE"]), getAuditTrail);


module.exports = router;
