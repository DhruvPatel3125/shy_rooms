const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');

router.post('/bookroom',async(req,res)=>{
    const {
        roomname,
        roomid,
        userid,
        fromdate,
        todate,
        totalammount,
        totaldays
    } = req.body

    try {
        const newBooking = new Booking({
            room:roomname,  
            roomid:roomid,
            userid,
            fromdate,
            todate,
            totalammount,
            totaldays,
            transactionId: '1234'
        })
        await newBooking.save();
        res.send('Room booked successfully');
    } catch (error) {
        return res.status(400).json({message: error.message || String(error)});
    }
});

module.exports = router;