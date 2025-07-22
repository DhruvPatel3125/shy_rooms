import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Homescreen = () => {
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get('/api/rooms/getallrooms');
        setRooms(data.rooms); // <-- Fix here
      } catch (error) {
        console.log(error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <>
      <h1>There are {rooms.length} rooms</h1>
    </>
  );
};

export default Homescreen;