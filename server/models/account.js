const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'],
        required: true,
    },
    normalBalance: {
        type: String,
        enum: ['debit', 'credit'],
        required: true,
        default: 'debit'
    },
    balance: {
        type: Number,
        default: 0,
    },
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;