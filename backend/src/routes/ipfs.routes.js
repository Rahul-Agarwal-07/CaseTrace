const express = require("express");
const multer = require("multer");
const { uploadToIPFS } = require("../ipfs/ipfs.service");

const router = express.Router();

// store file in memory (buffer)
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /ipfs/upload
 * form-data: file
 */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const cid = await uploadToIPFS(
      req.file.buffer,
      req.file.originalname
    );

    res.json({
      success: true,
      cid
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "IPFS upload failed" });
  }
});

module.exports = router;
