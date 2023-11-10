const express = require('express');
const router = express.Router();
const { getBalanceSheet } = require('../controllers/balanceSheetController');

// Balance Sheet routes
router.get('/', getBalanceSheet);

module.exports = router;