const express = require('express');
const router = express.Router();
const { getIncomeStatement } = require('../controllers/incomeStatementController');

// Income Statement routes
router.get('/', getIncomeStatement);

module.exports = router;