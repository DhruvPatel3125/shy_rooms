const express = require('express');
const router = express.Router();
const moment = require('moment');

const Room = require("../models/room")

router.get("/getallrooms",async(req,res)=>{

   try {
    const rooms = await Room.find({})
    return res.json({rooms})
   } catch (error) {
    return res.status(400).json({message:error})
   }
})

router.post("/getallrooms", async (req, res) => {
  const { fromdate, todate } = req.body;

  try {
    const rooms = await Room.find({});
    const availableRooms = [];

    for (const room of rooms) {
      let hasBooked = false;
      if (room.currentbookings && room.currentbookings.length > 0) {
        for (const booking of room.currentbookings) {
          const bookingFromDate = moment(booking.fromdate, "DD-MM-YYYY");
          const bookingToDate = moment(booking.todate, "DD-MM-YYYY");
          const requestedFromDate = moment(fromdate, "DD-MM-YYYY");
          const requestedToDate = moment(todate, "DD-MM-YYYY");

          if (
            requestedFromDate.isBetween(bookingFromDate, bookingToDate, null, '[]') ||
            requestedToDate.isBetween(bookingFromDate, bookingToDate, null, '[]') ||
            bookingFromDate.isBetween(requestedFromDate, requestedToDate, null, '[]') ||
            bookingToDate.isBetween(requestedFromDate, requestedToDate, null, '[]')
          ) {
            hasBooked = true;
            break;
          }
        }
      }
      if (!hasBooked) {
        availableRooms.push(room);
      }
    }
    res.json({ rooms: availableRooms });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.get("/getroombyid/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    return res.json(room);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;