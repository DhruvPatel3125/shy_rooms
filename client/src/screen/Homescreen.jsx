import React, { useEffect, useState } from "react";
import axios from "axios";
import Room from "../components/Room"; // <-- Import Room component
import Loader from "../components/Loader";
import Error from "../components/Error";
import { DatePicker, Space } from "antd";
import moment from 'moment' 
// import 'antd/dist/antd.css'

const Homescreen = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [fromdate,setFromdate] = useState();
  const [todate,setTodate] = useState();

  const user = JSON.parse(localStorage.getItem("currentUser"));
  const isLoggedIn = !!user; // Check if user exists
  const { RangePicker } = DatePicker;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/rooms/getallrooms");
        setRooms(data.rooms); // Make sure your backend returns { rooms: [...] }
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);
  function filterByDate(dates) {
    if (!dates || dates.length === 0) {
      // If dates are cleared, fetch all rooms
      const fetchAllRooms = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get("/api/rooms/getallrooms");
          setRooms(data.rooms);
          setLoading(false);
        } catch (error) {
          setError(true);
          console.log(error);
          setLoading(false);
        }
      };
      fetchAllRooms();
      setFromdate(null);
      setTodate(null);
      return;
    }

    // Set the selected dates
    setFromdate(dates[0].format("DD-MM-YYYY"));
    setTodate(dates[1].format("DD-MM-YYYY"));
    
    // Fetch only available rooms for the selected dates from server
    const fetchAvailableRooms = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post("/api/rooms/getallrooms", {
          fromdate: dates[0].format("DD-MM-YYYY"),
          todate: dates[1].format("DD-MM-YYYY"),
        });
        setRooms(data.rooms); // Server returns only available rooms
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    };
    fetchAvailableRooms();
  }

  return (
    <>
      <div className="container">
        <div className="row mt-5">
          <div className="col-md-3">
            <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          {loading ? (
            <Loader />
          ) : rooms.length > 0 ? (
            rooms.map((room) => {
              return (
                <div className="col-md-9 mt-2" key={room._id}>
                  <Room room={room} isLoggedIn={isLoggedIn} fromdate={fromdate} todate={todate} />
                </div>
              );
            })
          ) : (
            <div className="col-md-12 text-center">
              <h3>No rooms available for the selected dates</h3>
              <p>Please try different dates or check back later.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Homescreen;
