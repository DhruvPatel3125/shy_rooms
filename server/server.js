require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const dbConfig = require('./db')

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});
