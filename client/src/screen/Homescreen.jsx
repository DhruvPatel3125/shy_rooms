import React, { useEffect } from 'react';
import axios from 'axios';

const Homescreen = () => {
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get('/api/rooms/getallrooms');
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <>
      <h1>homme cappl</h1>
    </>
  );
};

export default Homescreen;