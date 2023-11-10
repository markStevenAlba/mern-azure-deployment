const express = require('express');
const router = express.Router();
const {
    createAccount,
    getAllAccounts,
    getAccountById,
    updateAccount,
    deleteAccount,
    createAiAccount,
    resetAccounts
} = require('../controllers/accountController');
const { validateAccount } = require('../utils/validation');

// Create a new account
router.post('/', validateAccount, createAccount);

router.post('/aiaccount', createAiAccount);


// Get all accounts
router.get('/', getAllAccounts);

router.get('/reset', resetAccounts);


// Get a specific account by ID
router.get('/:account_id', getAccountById);



// Update an account by ID
router.put('/:account_id', updateAccount);

// Delete an account by ID
router.delete('/:account_id', deleteAccount);

module.exports = router;
