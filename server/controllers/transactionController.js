

const Transaction = require('../models/transaction');
const Account = require('../models/account');
const { validateAccountExist, isJsonString } = require('../utils/validation');
const ChatGPTFunction = require('../utils/openai');


// Validation function for transaction data
const validateTransaction = (transactionData) => {
    // Implement your validation logic here
    // Example: Ensure that the transaction is balanced (total debit equals total credit)
    const totalDebit = transactionData.entries.reduce((sum, entry) => {
        return entry.type === 'debit' ? sum + entry.amount : sum;
    }, 0);
    const totalCredit = transactionData.entries.reduce((sum, entry) => {
        return entry.type === 'credit' ? sum + entry.amount : sum;
    }, 0);

    return totalDebit === totalCredit;
};


// Controller function for creating a new transaction
const createTransaction = async (req, res) => {
    try {
        const { date, description, entries } = req.body;

        // Validate the request data
        if (!description || !entries || entries.length < 2 || !validateTransaction({ entries })) {
            return res.status(400).json({ error: 'Invalid transaction data.' });
        }

        let valid = await validateAccountExist(entries)

        console.log(valid, 'IS VALID')
        if (!valid) {
            return res.status(400).json({ error: 'Invalid account' });
        }

        // Create a new transaction
        const newTransaction = new Transaction({
            date: new Date(),
            description,
            entries,
        });

        // Save the transaction to the database
        await newTransaction.save();

        // Update account balances based on the transaction entries
        await updateAccountBalances(entries);

        res.status(201).json(newTransaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the transaction.' });
    }
};


// Controller function for creating a new transaction
const createAiEntry = async (req, res) => {
    try {
        const { entry } = req.body;

        if (!entry) {
            return res.status(404).json({ message: 'Entry is Empty!' })
        }

        //Get Chart of Accounts
        let accounts = await Account.find();

        let charts = [];

        for (let item of accounts) {
            let { _id, name, normalBalance, type, balance } = item;
            charts.push({
                _id, name, normalBalance, type,
                balance
            })
        }

        let sampleResponse = { "description": "", "entries": [{ "account": "Account uuid", "name": "Account Name", "amount": 0, "type": "debit" }, { "account": "Account uuid", "name": "Account Name", "amount": 0, "type": "credit" }] }

        let prompt = `Following the double entry rule bookkepping, Generate a journal entry transaction in JSON format based on the following transaction details: ${entry}.
        \n
        Select entries from Chart of accounts below: \n
        ${JSON.stringify(charts)}
        \n
        Return Complete Beautify JSON object following same context with: \n
            ${JSON.stringify(sampleResponse)}.`

        let aiResponse = await ChatGPTFunction(prompt)

        console.log(aiResponse, 'ress')
        // Remove the extra words and keep only the JSON part
        let cleanedText = aiResponse.replace(/\/\/.*/g, '')
        cleanedText = cleanedText.replace(/["'`]/g, '"');
        const jsonStartIndex = cleanedText.indexOf('{');
        const jsonString = cleanedText.substring(jsonStartIndex);

        // Parse the JSON string into a JavaScript object
        console.log(jsonString, 'JSON')
        const jsonObject = JSON.parse(jsonString);


        return res.status(200).json(jsonObject);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while creating the transaction.' });
    }
};


const getAllTransactions = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({ error: 'Start date and end date parameters are required.' });
        }

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        // Set the time component of the dates to the start and end of the day
        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(23, 59, 59, 999);


        const transactions = await Transaction.find({
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        }).populate('entries.account').sort({ date: -1 });




        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching transactions.' });
    }
};

const getTransactionById = async (req, res) => {
    // Implementation for fetching a specific transaction by ID

};

// Function to update account balances based on transaction entries
const updateAccountBalances = async (entries) => {
    for (const entry of entries) {
        const account = await Account.findById(entry.account);

        if (((entry.type === 'debit' && account.normalBalance === 'debit') || (entry.type === 'credit' && account.normalBalance === 'credit'))) {
            account.balance += entry.amount;
        } else if (((entry.type === 'credit' && account.normalBalance === 'debit') || (entry.type === 'debit' && account.normalBalance === 'credit'))) {
            account.balance -= entry.amount;
        }

        await account.save();
    }
};

module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    createAiEntry
};
