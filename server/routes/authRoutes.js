const express = require('express');
const router = express.Router();
const { authUser } = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', authUser);

module.exports = router;