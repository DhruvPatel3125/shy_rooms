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
        // Validate required fields
        if (!roomname || !roomid || !userid || !fromdate || !todate || !totalammount || !totaldays) {
            return res.status(400).json({
                success: false,
                message: 'All booking fields are required'
            });
        }

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
        
        res.json({
            success: true,
            message: 'Room booked successfully',
            booking: newBooking
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || String(error)
        });
    }
});

module.exports = router;