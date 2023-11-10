const Account = require('../models/account');

// Middleware function for validating account creation
const validateAccount = async (req, res, next) => {
    try {
        const { name, type, normalBalance } = req.body;



        // Validate the request data
        if (!name || !type) {
            return res.status(400).json({ error: 'Name, type, and normal balance are required.' });
        }

        let newNormalBalance = normalBalance ? normalBalance : (type === 'Asset' || type === 'Expense') ? 'debit' : 'credit'


        // Check if an account with the same name, type, and normal balance already exists
        const existingAccount = await Account.findOne({ name, type, normalBalance: newNormalBalance });

        if (existingAccount) {
            return res.status(400).json({ error: 'Account with the same name, type, and normal balance already exists.' });
        }
        req.body.normalBalance = newNormalBalance
        // If the account data is valid and no duplicates are found, proceed to the next middleware or route
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while validating the account.' });
    }
};


const validateAccountExist = async (entries) => {
    let valid = true

    for (const entry of entries) {
        const account = await Account.findById(entry.account);
        if (!account) {
            valid = false;
        }
    }


    return valid
};

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

module.exports = { validateAccount, validateAccountExist, isJsonString };
