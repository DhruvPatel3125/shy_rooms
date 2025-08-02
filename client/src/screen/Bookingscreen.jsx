import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
//dewre
const Bookingscreen = () => {
  const { roomid, fromdate, todate } = useParams();
  const [room, setRoom] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  
  // Decode URL parameters and validate dates
  const decodedFromDate = decodeURIComponent(fromdate);
  const decodedToDate = decodeURIComponent(todate);
  
  // Validate dates before calculating total days
  const fromDateMoment = moment(decodedFromDate, "DD-MM-YYYY", true);
  const toDateMoment = moment(decodedToDate, "DD-MM-YYYY", true);
  
  const totalDays = fromDateMoment.isValid() && toDateMoment.isValid() 
    ? toDateMoment.diff(fromDateMoment, "days") 
    : 0;

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/rooms/getroombyid/${roomid}`);
        setRoom(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomid]);

 async function bookRoom(){
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  // Validate user is logged in
  if (!currentUser || !currentUser._id) {
    alert('Please login to book a room');
    return;
  }

  // Validate room data is loaded
  if (!room || !room._id || !room.name || !room.rentperday) {
    alert('Room information is not loaded properly. Please refresh the page.');
    return;
  }

  // Validate dates
  if (!fromDateMoment.isValid()) {
    alert('Invalid from date format. Please select dates again.');
    return;
  }
  
  if (!toDateMoment.isValid()) {
    alert('Invalid to date format. Please select dates again.');
    return;
  }

  // Validate dates and total days
  if (totalDays <= 0) {
    alert('Invalid date selection. Check-out date must be after check-in date.');
    return;
  }

  // Check if from date is not in the past
  if (fromDateMoment.isBefore(moment(), "day")) {
    alert('Check-in date cannot be in the past. Please select a future date.');
    return;
  }

  const bookingDetails = {
    roomname: room.name,
    roomid: room._id,
    userid: currentUser._id,
    fromdate: decodedFromDate,
    todate: decodedToDate,
    totalammount: totalDays * room.rentperday,
    totaldays: totalDays,
  }
  
  console.log('Booking details:', bookingDetails);
  
  try {
    const result = await axios.post('/api/bookings/bookroom', bookingDetails);
    if(result.data.success){
      alert('Room booked successfully!');
      // Optionally redirect to bookings page or home
      // window.location.href = '/';
    } else {
      alert('Booking failed: ' + (result.data.message || 'Something went wrong'));
    }
  } catch (error) {
    console.error('Booking error:', error);
    alert('Booking failed: ' + (error.response?.data?.message || error.message));
  }
}

  return (
    <div className="m-5">
      {loading ? (
        <Loader />
      ) : room ? (
        <div>
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-6">
              <h1>{room?.name}</h1>
              <img
                src={room?.imageurls && room.imageurls[0]}
                className="bigimage"
                alt=""
                style={{ width: '650px', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
            <div className="col-md-6">
              <h1>Booking details</h1>
              <hr />

              <b>
                <p>Name : {JSON.parse(localStorage.getItem('currentUser')).name}</p>
                <p>From Date : {fromDateMoment.isValid() ? fromDateMoment.format("DD-MM-YYYY") : decodedFromDate}</p>
                <p>To Date : {toDateMoment.isValid() ? toDateMoment.format("DD-MM-YYYY") : decodedToDate}</p>    
                <p>Max Count : {room.maxcount}</p>
              </b>

              <div>
                <b>
                  <h1>Ammount</h1>
                  <hr />
                  <p>Total days : {totalDays.toString() }</p> 
                  <p>Rent per days : {room.rentperday}</p>
                  <p>Total Ammont : {totalDays * room.rentperday}</p>
                </b>
              </div>
              <div style={{float:'right'}}>
                <button className="btn btn-primary"onClick={bookRoom}>Pay now</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error/>
      )}
    </div>
  );
};

export default Bookingscreen;
