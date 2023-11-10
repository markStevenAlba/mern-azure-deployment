const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: false,
        default: new Date()
    },
    description: {
        type: String,
        required: true,
    },
    entries: [
        {
            account: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Account',
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
            type: {
                type: String,
                enum: ['debit', 'credit'],
                required: true,
            },
        },
    ],
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;