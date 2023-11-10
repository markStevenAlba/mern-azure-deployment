const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");
const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

app.use(express.json());
app.use(cors())

// Import and use your route files here
const accountRoutes = require('./server/routes/accountRoutes');
const transactionRoutes = require('./server/routes/transactionRoutes');
// const ledgerRoutes = require('./routes/ledgerRoutes');
// const incomeStatementRoutes = require('./routes/incomeStatementRoutes');
// const balanceSheetRoutes = require('./routes/balanceSheetRoutes');

app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
// app.use('/api/ledger', ledgerRoutes);
// app.use('/api/income-statement', incomeStatementRoutes);
// app.use('/api/balance-sheet', balanceSheetRoutes);

// Error handling middleware
app.use(require('./server/middlewares/errorHandling'));



app.use(express.static('./client/dist'));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
