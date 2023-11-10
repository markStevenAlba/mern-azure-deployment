const express = require('express');
const router = express.Router();
const {
    getDebitBalance,
    getCreditBalance,
    getTrialBalance,
} = require('../controllers/ledgerController');

// Ledger routes
router.get('/debit-balance/:account_id', getDebitBalance);
router.get('/credit-balance/:account_id', getCreditBalance);
router.get('/trial-balance', getTrialBalance);

module.exports = router;
