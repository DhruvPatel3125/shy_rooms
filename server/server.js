require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT||5000;
const dbConfig = require('./db')
const roomsRoute = require("./routes/roomsRoute")

app.use('/api/rooms',roomsRoute)

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});
