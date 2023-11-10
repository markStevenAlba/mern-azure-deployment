
const mongoose = require("mongoose");
const Account = require('../models/account');
const Transaction = require('../models/transaction');
const connection = mongoose.connection;

const ChatGPTFunction = require('../utils/openai');

// Controller function for creating a new account
const createAccount = async (req, res) => {
    try {
        const { name, type, normalBalance } = req.body;

        // Validate the request data
        if (!name || !type) {
            return res.status(400).json({ error: 'Name and type are required for creating an account.' });
        }


        // Create a new account
        const newAccount = new Account({
            name,
            type,
            normalBalance
        });

        // Save the account to the database
        await newAccount.save();
        // Return the created account as a response
        res.status(201).json(newAccount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the account.' });
    }
};



const createAiAccount = async (req, res) => {
    try {


        let promp1 = 'What is your name?'

        let aiResponse = await ChatGPTFunction(promp1)
        res.json(aiResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching accounts.' });
    }
};


const getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.find();
        res.json(accounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching accounts.' });
    }
};

// Controller function for fetching a specific account by ID
const getAccountById = async (req, res) => {
    try {
        const accountId = req.params.account_id;

        // Validate the account ID format
        if (!accountId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid account ID format.' });
        }

        const account = await Account.findById(accountId);

        if (!account) {
            return res.status(404).json({ error: 'Account not found.' });
        }

        res.json(account);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the account.' });
    }
};


const updateAccount = async (req, res) => {
    // Implementation for updating an account by ID
};

const deleteAccount = async (req, res) => {
    // Implementation for deleting an account by ID
};


const resetAccounts = async (req, res) => {
    // Implementation for deleting an account by ID
    await Account.updateMany(
        { balance: { $ne: 0 } }, // Find accounts with balance not equal to 0
        { $set: { balance: 0 } }  // Set balance to 0 for matched accounts
    );
    connection.dropCollection("transactions");
    res.send('Reset Successfully!');
};



module.exports = {
    createAccount,
    getAllAccounts,
    getAccountById,
    updateAccount,
    deleteAccount,
    createAiAccount,
    resetAccounts
};