import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";

function Adminscreen() {
  return (
    <div className="mt-3 ml-3 mr-3 bs">
      <h2 className="text-center" style={{ fontSize: "30px" }}>
        <b>Admin Panal</b>
      </h2>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Bookings",
            children: <Bookings />,
          },
          {
            key: "2",
            label: "Rooms",
            children: <h1>Rooms</h1>,
          },
          {
            key: "3",
            label: "Add Room",
            children: <h1>Add Rooms</h1>,
          },
          {
            key: "4",
            label: "Users",
            children: <h1>Users</h1>,
          },
        ]}
      />
    </div>
  );
}
export default Adminscreen;

export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/bookings/getallbookings");
        const list = Array.isArray(data) ? data : data?.bookings || [];
        setBookings(list);
      } catch (err) {
        console.log(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="row">
      <div className="col-md-10">
        <h1>Bookings</h1>
        {loading && <Loader />}
        {error && <Error />}
        <h1>There are total {bookings?.length ?? 0} bookings</h1>
      </div>
    </div>
  );
}
