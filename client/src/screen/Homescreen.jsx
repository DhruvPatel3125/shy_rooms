import React, { useEffect, useState } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { DatePicker } from "antd";

const Homescreen = () => {
  const [rooms, setRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [fromdate, setFromdate] = useState();
  const [todate, setTodate] = useState();
  const [searchkey, setSearchkey] = useState("");
  const [type, setType] = useState("all");

  const user = JSON.parse(localStorage.getItem("currentUser"));
  const isLoggedIn = !!user;
  const { RangePicker } = DatePicker;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/rooms/getallrooms");
        setRooms(data.rooms);
        setAllRooms(data.rooms);
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
      setRooms(allRooms);
      setFromdate(null);
      setTodate(null);
      return;
    }

    setFromdate(dates[0].format("DD-MM-YYYY"));
    setTodate(dates[1].format("DD-MM-YYYY"));

    // Date filtering can be added here if needed
  }

  // Apply both search + type filters together
  function applyFilters(searchValue, typeValue) {
    let filteredRooms = allRooms;

    // Filter by search text
    if (searchValue.trim() !== "") {
      filteredRooms = filteredRooms.filter(room =>
        room.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Filter by type
    if (typeValue !== "all") {
      filteredRooms = filteredRooms.filter(
        room => room.type.toLowerCase() === typeValue.toLowerCase()
      );
    }

    setRooms(filteredRooms);
  }

  function filterBySearch(e) {
    const value = e.target.value;
    setSearchkey(value);
    applyFilters(value, type);
  }

  function filterByType(value) {
    setType(value);
    applyFilters(searchkey, value);
  }

  return (
    <>
      <div className="container">
        <div className="row mt-5 align-items-center">
          <div className="col-md-3">
            <RangePicker
              format="DD-MM-YYYY"
              onChange={filterByDate}
              className="w-100"
            />
          </div>
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Search Rooms"
              value={searchkey}
              onChange={filterBySearch}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-control"
              value={type}
              onChange={(e) => filterByType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="delux">Delux</option>
              <option value="non-delux">Non-Delux</option>
              <option value="ac">AC</option>
            </select>
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          {loading ? (
            <Loader />
          ) : rooms.length > 0 ? (
            rooms.map((room) => (
              <div className="col-md-9 mt-2" key={room._id}>
                <Room
                  room={room}
                  isLoggedIn={isLoggedIn}
                  fromdate={fromdate}
                  todate={todate}
                />
              </div>
            ))
          ) : (
            <div className="col-md-12 text-center">
              <h3>No rooms available</h3>
              <p>Please try different filters.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Homescreen;
