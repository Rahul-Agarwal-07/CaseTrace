const pool = require('../db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

function generateRandomPassword(length = 8) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

function generateCaseId() {
  return `CASE-${Date.now()}`; // you can improve formatting if needed
}

exports.createCase = async (req, res) => {
  const { caseName, description } = req.body;

  try {
    if (!caseName || !description) {
      return res.status(400).json({ success: false, message: 'Case name and description required' });
    }

    // 1️⃣ Generate caseId
    const caseId = generateCaseId();

    // 2️⃣ Generate random passwords
    const invPass = generateRandomPassword();
    const viewPass = generateRandomPassword();
    const judPass = generateRandomPassword();

    // 3️⃣ Generate userIds
    const invUserId = `INV-${caseId}`;
    const viewUserId = `VIEW-${caseId}`;
    const judUserId = `JUD-${caseId}`;

    // 4️⃣ Hash passwords
    const invHash = await bcrypt.hash(invPass, 10);
    const viewHash = await bcrypt.hash(viewPass, 10);
    const judHash = await bcrypt.hash(judPass, 10);

    // 5️⃣ Insert users
    await pool.query(
      `INSERT INTO users (user_id, role, password_hash) VALUES
       ($1, 'INVESTIGATOR', $2),
       ($3, 'VIEWER', $4),
       ($5, 'JUDGE', $6)`,
      [invUserId, invHash, viewUserId, viewHash, judUserId, judHash]
    );

    // 6️⃣ Insert case
    await pool.query(
      `INSERT INTO cases (case_id, case_name, description, created_by)
       VALUES ($1, $2, $3, $4)`,
      [caseId, caseName, description, req.adminUserId] // assuming you have adminUserId from session
    );

    // 7️⃣ Insert case_users mapping
    await pool.query(
      `INSERT INTO case_users (case_id, user_id) VALUES
       ($1, $2), ($1, $3), ($1, $4)`,
      [caseId, invUserId, viewUserId, judUserId]
    );

    // 8️⃣ Respond with credentials
    res.status(201).json({
      success: true,
      caseId,
      users: [
        { role: 'INVESTIGATOR', userId: invUserId, password: invPass },
        { role: 'VIEWER', userId: viewUserId, password: viewPass },
        { role: 'JUDGE', userId: judUserId, password: judPass },
      ]
    });

  } catch (err) {
    console.error('Create case error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
