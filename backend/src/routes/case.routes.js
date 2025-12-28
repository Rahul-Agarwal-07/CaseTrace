const express = require('express');
const router = express.Router();
const { createCase } = require('../controllers/case.controller');
const { authenticateAdmin } = require('../middlewares/auth.middleware'); // optional middleware

// POST /api/cases/create
router.post('/create', authenticateAdmin, createCase);

module.exports = router;
