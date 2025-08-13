import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from 'sweetalert2';

function Adminscreen() {

useEffect(() => {
  try {
    const stored = localStorage.getItem('currentUser');
    const currentUser = stored ? JSON.parse(stored) : null;
    if (!currentUser || currentUser.isAdmin !== true) {
      window.location.href = '/login';
    }
  } catch (e) {
    // If parsing fails or anything unexpected happens, redirect to login
    window.location.href = '/login';
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
            children: <Addroom/>,
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


export function Addroom() {

const [name, setName] = useState("");
const [rentperday, setRentPerDay] = useState("");
const [maxcount, setMaxCount] = useState("");
const [description, setDescription] = useState("");
const [phonenumber,setPhoneNumber] = useState("");
const [type, setType] = useState("");
const [imageurl1, setImageUrl1] = useState("");
const [imageurl2, setImageUrl2] = useState("");
const [imageurl3, setImageUrl3] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

async function addRoom(){
  try {
    setLoading(true);
    setError(null);

    // Build request payload with proper types and trimming
    const images = [imageurl1, imageurl2, imageurl3].filter(url => url && url.trim() !== "");
    const newroom = {
      name: name.trim(),
      rentperday: Number(rentperday),
      maxcount: Number(maxcount),
      description: description.trim(),
      phonenumber: Number(phonenumber),
      type: type.trim(),
      imageurls: images
    };
    setLoading(true);
    const { data } = await axios.post('/api/rooms/addroom', newroom);
    console.log(data);
    setLoading(false);
    Swal.fire({
      icon:'success',
      title:"New room added successfully!"
    }).then(data=>{
      window.location.href="/home"
    })

    // Clear form on success
    setName("");
    setRentPerDay("");
    setMaxCount("");
    setDescription("");
    setPhoneNumber("");
    setType("");
    setImageUrl1("");
    setImageUrl2("");
    setImageUrl3("");
  } catch (err) {
    console.log(err);
    setError(err);
    Swal.fire({
      icon:'error',
      title:"Something went wrong!"
    })
  } finally {
    setLoading(false);
  }
}
  return (
    <div className="row">
      {loading && <Loader />}
      <div className="col-md-5">
        <input type="text" className="form-control" placeholder="Room name"  value={name} onChange={(e)=>{setName(e.target.value)}}/>
        <input type="text" className="form-control" placeholder="Rent Per day" value={rentperday} onChange={(e)=>{setRentPerDay(e.target.value)}}/>
        <input type="text" className="form-control" placeholder="Max Count" value={maxcount} onChange={(e)=>{setMaxCount(e.target.value)}} />
        <input type="text" className="form-control" placeholder="Description" value={description} onChange={(e)=>{setDescription(e.target.value)}} />
        <input type="text" className="form-control" placeholder="Phone number" value={phonenumber} onChange={(e)=>{setPhoneNumber(e.target.value)}}/>
      </div>
      <div className="col-md-5">
        <input type="text" className="form-control" placeholder="Type" value={type} onChange={(e)=>{setType(e.target.value)}} />
        <input type="text" className="form-control" placeholder="Image URL1" value={imageurl1} onChange={(e)=>{setImageUrl1(e.target.value)}} />
        <input type="text" className="form-control" placeholder="Image URL2" value={imageurl2} onChange={(e)=>{setImageUrl2(e.target.value)}} />
        <input type="text" className="form-control" placeholder="Image URL3" value={imageurl3} onChange={(e)=>{setImageUrl3(e.target.value)}} />

        <div className="d-flex justify-content-end align-items-center">
          <button className="btn btn-primary mt-2" type="submit" onClick={addRoom}>Add Room</button>
        </div>
      </div>
    </div>
  )
}
