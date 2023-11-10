const express = require('express');
const router = express.Router();
const {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    createAiEntry
} = require('../controllers/transactionController');

// Transaction routes
router.post('/', createTransaction);
router.post('/aientry', createAiEntry);
router.get('/', getAllTransactions);
router.get('/:transaction_id', getTransactionById);

module.exports = router;
