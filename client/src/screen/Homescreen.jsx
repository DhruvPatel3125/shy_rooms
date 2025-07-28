import React, { useEffect, useState } from "react";
import axios from "axios";
import Room from "../components/Room"; // <-- Import Room component
import Loader from "../components/Loader";
import Error from "../components/Error";

const Homescreen = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  const user = JSON.parse(localStorage.getItem("currentUser"));
  const isLoggedIn = !!user; // Check if user exists

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

  return (
    <>
      <div className="container">
        <div className="row justify-content-center mt-5">
          {loading ? (
            <Loader/>
          ) : rooms.length>1 ? (
              rooms.map((room) => {
                return <div className="col-md-9 mt-2" key={room._id}>
                  <Room room={room} isLoggedIn={isLoggedIn}/>
                </div>
              })
          ) : (
            <Error/>
          )}
        </div>
      </div>
    </>
  );
};

export default Homescreen;
