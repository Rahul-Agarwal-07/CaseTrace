const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const evidenceRoutes = require("./routes/evidence.routes");
const ipfsRoutes = require("./routes/ipfs.routes");
const authRoutes = require("./routes/auth.routes");
const caseRoutes = require("./routes/case.routes");

const app = express();

// -------- Global Middleware -------
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// -------- Routes --------
app.use("/api/evidence", evidenceRoutes);
app.use("/ipfs", ipfsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);

// -------- Health Check --------
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Backend running" });
});

module.exports = app;
