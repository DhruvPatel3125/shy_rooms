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
  const totalDays = moment(todate, "DD-MM-YYYY").diff(moment(fromdate, "DD-MM-YYYY"), "days");
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
                <p>Name:</p>
                <p>From Date:{moment(fromdate, "DD-MM-YYYY").format("DD-MM-YYYY")}</p>
                <p>To Date:{moment(todate, "DD-MM-YYYY").format("DD-MM-YYYY")}</p>    
                <p>Max Count:{room.maxcount}</p>
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
                <button className="btn btn-primary">Pay now</button>
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
