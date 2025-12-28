const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

exports.login = async (req, res) => {
  const { userId, password } = req.body;

  try {
    /* ---------------- 1. Fetch user ---------------- */
    const userResult = await pool.query(
      `SELECT user_id, password_hash, role, wallet_address
             FROM users
             WHERE user_id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = userResult.rows[0];

    /* ---------------- 2. Verify password ---------------- */
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.role === "ADMIN") {
      const tokenPayload = {
        userId: user.user_id,
        role: user.role,
      };

      const sessionToken = jwt.sign(tokenPayload, JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({
        success: true,
        userId: user.user_id,
        role: user.role,
        sessionToken,
      });
    }

    /* ---------------- 3. Fetch cases user has access to ---------------- */
    const casesResult = await pool.query(
      `SELECT c.case_id, c.created_by, c.created_at
             FROM cases c
             JOIN case_users cu ON cu.case_id = c.case_id
             WHERE cu.user_id = $1
             ORDER BY c.created_at DESC`,
      [userId]
    );

    if (casesResult.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "No cases assigned to this user",
      });
    }

    const cases = casesResult.rows;

    /* ---------------- 4. Select active case ---------------- */
    const activeCase = cases[0]; // latest case

    /* ---------------- 5. Generate JWT ---------------- */
    const tokenPayload = {
      userId: user.user_id,
      role: user.role,
      walletAddress: user.wallet_address,
      caseId: activeCase.case_id,
    };

    const sessionToken = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "1h",
    });

    /* ---------------- 6. Respond ---------------- */
    return res.status(200).json({
      success: true,
      userId: user.user_id,
      role: user.role,
      walletAddress: user.wallet_address,
      activeCaseId: activeCase.case_id,
      cases,
      sessionToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // 1️⃣ Check if email already exists
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // 2️⃣ Generate random userId with prefix ADMIN-
    const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6 chars
    const userId = `ADMIN-${randomSuffix}`;

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Insert into DB
    await pool.query(
      `INSERT INTO users (user_id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, name, email, hashedPassword, "ADMIN"]
    );

    // 5️⃣ Respond
    res.status(201).json({
      success: true,
      message: "Admin account created",
      userId: userId,
      role: "ADMIN",
    });
  } catch (err) {
    console.error("Create admin error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
