require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT||5000;
const dbConfig = require('./db')
const roomsRoute = require("./routes/roomsRoute")

const usersRoute = require('./routes/usersRoute') 
const bookingRoute = require('./routes/bookingRoute')

app.use(express.json())

app.use('/api/rooms',roomsRoute)
app.use('/api/users',usersRoute)
app.use('/api/bookings',bookingRoute)

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});
