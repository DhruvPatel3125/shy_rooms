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
    console.log('Filtering rooms for dates:', { fromdate, todate });
    
    // Validate input dates
    if (!fromdate || !todate) {
      return res.status(400).json({ message: "Both fromdate and todate are required" });
    }

    const requestedFromDate = moment(fromdate, "DD-MM-YYYY", true);
    const requestedToDate = moment(todate, "DD-MM-YYYY", true);

    if (!requestedFromDate.isValid() || !requestedToDate.isValid()) {
      return res.status(400).json({ message: "Invalid date format. Use DD-MM-YYYY" });
    }

    const rooms = await Room.find({});
    const availableRooms = [];
    let totalRooms = rooms.length;
    let filteredCount = 0;

    for (const room of rooms) {
      let isAvailable = true;
      
      if (room.currentbookings && room.currentbookings.length > 0) {
        for (const booking of room.currentbookings) {
          const bookingFromDate = moment(booking.fromdate, "DD-MM-YYYY");
          const bookingToDate = moment(booking.todate, "DD-MM-YYYY");

          // Check for any overlap between requested dates and existing booking
          // Dates overlap if: requested start <= booking end AND requested end >= booking start
          const hasOverlap = requestedFromDate.isSameOrBefore(bookingToDate) && 
                            requestedToDate.isSameOrAfter(bookingFromDate);

          if (hasOverlap) {
            console.log(`Room ${room.name} is unavailable - booking conflict:`, {
              requestedDates: `${fromdate} to ${todate}`,
              existingBooking: `${booking.fromdate} to ${booking.todate}`
            });
            isAvailable = false;
            filteredCount++;
            break;
          }
        }
      }
      
      if (isAvailable) {
        availableRooms.push(room);
      }
    }

    console.log(`Room filtering complete: ${availableRooms.length}/${totalRooms} rooms available (${filteredCount} filtered out)`);
    res.json({ rooms: availableRooms });
  } catch (error) {
    console.error('Error filtering rooms:', error);
    return res.status(400).json({ message: error.message || String(error) });
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

router.post('/addroom',async(req,res)=>{
  try {
     const newRoom = new Room(req.body)
     await newRoom.save()
     res.send("New Room Added")
  } catch (error) {
    return res.status(400).json({message:error})
  }
})

module.exports = router;