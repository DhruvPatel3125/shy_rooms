import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";

function Adminscreen() {

useEffect(() => {
  if(JSON.parse(localStorage.getItem('currentUser')).isAdmin!==true){
    window.location.href='/home'
  }
}, [])


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
            children: <Rooms/>,
          },
          {
            key: "3",
            label: "Add Room",
            children: <h1>Add Rooms</h1>,
          },
          {
            key: "4",
            label: "Users",
            children: <Users/>,
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
      <div className="col-md-12">
        <h1>Bookings</h1>
        {loading && <Loader />}
        {error && <Error />}
        <table className="table table-borser table-dark">
          <thead className="bs">
            <tr>
              <th>Booking Id</th>
              <th>User Id</th>
              <th>Room</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking)=>(
              <tr>
                <td>{booking._id}</td>
                <td>{booking.userid}</td>
                <td>{booking.room}</td>
                <td>{booking.fromdate.toString().substr(0,10)}</td>
                <td>{booking.todate.toString().substr(0,10)}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}

export function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/rooms/getallrooms");
        const list = Array.isArray(data) ? data : data?.rooms || [];
        setRooms(list);
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
      <div className="col-md-12">
        <h1>Rooms</h1>
        {loading && <Loader />}
        {error && <Error />}
        <table className="table table-borser table-dark">
          <thead className="bs">
            <tr>
              <th>Room Id</th>
              <th>Name</th>
              <th>Type</th>
              <th>Rent per day</th>
              <th>Max Count</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room)=>(
              <tr>
                <td>{room._id}</td>
                <td>{room.name}</td>
                <td>{room.type}</td>
                <td>{room.rentperday}</td>
                <td>{room.maxcount}</td>
                <td>{room.phonenumber}</td>
              </tr>
            ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}


export function Users(){
   const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(()=>{
     const fetchUsers=async()=>{
       setLoading(true)
       try{
         const {data}=await axios.get('/api/users/getallusers')
         const list=Array.isArray(data)?data:data.users||[]
         setUsers(list)
       }catch(error){
         setError(error)
       }finally{
         setLoading(false)
       }
     }
     fetchUsers()
     
  },[])
  return(
    <div className="row">
      <div className="col-md-12">
        <h1>Users</h1>
        {loading&&<Loader/>}
        {error&&<Error/>}
        <table className="table table-bordered table-dark">
          <thead>
             <tr>
               <th>ID</th>
               <th>Name</th>
               <th>Email</th>
               <th>Is Admin</th>
             </tr>
          </thead>  
          <tbody>
            {users.map(user=>(
              <tr>
                 <td>{user._id}</td>
                 <td>{user.name}</td>
                 <td>{user.email}</td>
                 <td>{user.isAdmin?'Yes':'No'}</td>
              </tr>
            ))}
          </tbody>  
        </table>
      </div>
    </div>
  )
}