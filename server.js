const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3005;
// Serve static files from the "public" directory
app.use(cors())
// Define a simple route
app.get('/api', (req, res) => {
    res.send('Hello, World!');
});


app.use(express.static('./client/build'));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
})


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});