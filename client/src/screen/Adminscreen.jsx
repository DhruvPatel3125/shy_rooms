import React, { useState, useEffect } from "react";
import { Tabs, Modal, Button, Form, Input, InputNumber, Select, Card, Row, Col } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from 'sweetalert2';

const { Option } = Select;

function Adminscreen() {
  useEffect(() => {
    try {
      const stored = localStorage.getItem('currentUser');
      const currentUser = stored ? JSON.parse(stored) : null;
      if (!currentUser || currentUser.isAdmin !== true) {
        window.location.href = '/login';
      }
    } catch (e) {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className="col-12">
          <Card className="shadow-sm">
            <div className="text-center mb-4">
              <h1 className="h2 text-primary">
                <i className="fas fa-cog me-2"></i>
                Admin Panel
              </h1>
              <p className="text-muted">Manage bookings, rooms, and users</p>
            </div>
            <Tabs
              defaultActiveKey="1"
              type="card"
              items={[
                {
                  key: "1",
                  label: (
                    <span>
                      <i className="fas fa-calendar-check me-2"></i>
                      Bookings
                    </span>
                  ),
                  children: <Bookings />,
                },
                {
                  key: "2",
                  label: (
                    <span>
                      <i className="fas fa-hotel me-2"></i>
                      Rooms
                    </span>
                  ),
                  children: <Rooms />,
                },
                {
                  key: "3",
                  label: (
                    <span>
                      <i className="fas fa-plus-circle me-2"></i>
                      Add Room
                    </span>
                  ),
                  children: <Addroom />,
                },
                {
                  key: "4",
                  label: (
                    <span>
                      <i className="fas fa-users me-2"></i>
                      Users
                    </span>
                  ),
                  children: <Users />,
                },
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Adminscreen;

export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

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

  const deleteBooking = async (bookingId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await axios.delete(`/api/bookings/deletebooking/${bookingId}`);
        Swal.fire('Deleted!', 'Booking has been deleted.', 'success');
        fetchBookings();
      }
    } catch (error) {
      Swal.fire('Error!', 'Failed to delete booking.', 'error');
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    const statusClass = {
      'confirmed': 'bg-success',
      'pending': 'bg-warning',
      'cancelled': 'bg-danger',
      'completed': 'bg-info'
    }[status] || 'bg-secondary';
    
    return <span className={`badge ${statusClass}`}>{status}</span>;
  };

  return (
    <div className="row">
      <div className="col-12">
        <Card className="shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">
              <i className="fas fa-calendar-check text-primary me-2"></i>
              Bookings Management
            </h4>
            <Button 
              type="primary" 
              onClick={fetchBookings}
              icon={<i className="fas fa-sync-alt me-2"></i>}
            >
              Refresh
            </Button>
          </div>
          
          {loading && <Loader />}
          {error && <Error />}
          
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Booking ID</th>
                  <th>User ID</th>
                  <th>Room</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="fw-bold text-primary">{booking._id}</td>
                    <td>{booking.userid}</td>
                    <td>{booking.room}</td>
                    <td>{new Date(booking.fromdate).toLocaleDateString()}</td>
                    <td>{new Date(booking.todate).toLocaleDateString()}</td>
                    <td>{getStatusBadge(booking.status)}</td>
                    <td>
                      <Button
                        type="primary"
                        danger
                        size="small"
                        onClick={() => deleteBooking(booking._id)}
                        icon={<i className="fas fa-trash me-1"></i>}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {bookings.length === 0 && !loading && (
            <div className="text-center py-4">
              <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No bookings found</h5>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
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

  const deleteRoom = async (roomId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await axios.delete(`/api/rooms/deleteroom/${roomId}`);
        Swal.fire('Deleted!', 'Room has been deleted.', 'success');
        fetchRooms();
      }
    } catch (error) {
      Swal.fire('Error!', 'Failed to delete room.', 'error');
      console.error(error);
    }
  };

  const editRoom = (room) => {
    setEditingRoom(room);
    form.setFieldsValue({
      name: room.name,
      type: room.type,
      rentperday: room.rentperday,
      maxcount: room.maxcount,
      phonenumber: room.phonenumber,
      description: room.description,
      imageurl1: room.imageurls?.[0] || '',
      imageurl2: room.imageurls?.[1] || '',
      imageurl3: room.imageurls?.[2] || '',
    });
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      setLoading(true);
      const images = [values.imageurl1, values.imageurl2, values.imageurl3].filter(url => url && url.trim() !== "");
      
      const updatedRoom = {
        name: values.name.trim(),
        type: values.type.trim(),
        rentperday: values.rentperday,
        maxcount: values.maxcount,
        phonenumber: values.phonenumber,
        description: values.description.trim(),
        imageurls: images
      };

      await axios.put(`/api/rooms/updateroom/${editingRoom._id}`, updatedRoom);
      
      Swal.fire('Success!', 'Room updated successfully!', 'success');
      setIsEditModalVisible(false);
      setEditingRoom(null);
      form.resetFields();
      fetchRooms();
    } catch (error) {
      Swal.fire('Error!', 'Failed to update room.', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeBadge = (type) => {
    const typeClass = {
      'Deluxe': 'bg-primary',
      'Non-Deluxe': 'bg-secondary',
      'Suite': 'bg-success',
      'Luxury': 'bg-warning'
    }[type] || 'bg-info';
    
    return <span className={`badge ${typeClass}`}>{type}</span>;
  };

  return (
    <div className="row">
      <div className="col-12">
        <Card className="shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">
              <i className="fas fa-hotel text-primary me-2"></i>
              Rooms Management
            </h4>
            <Button 
              type="primary" 
              onClick={fetchRooms}
              icon={<i className="fas fa-sync-alt me-2"></i>}
            >
              Refresh
            </Button>
          </div>
          
          {loading && <Loader />}
          {error && <Error />}
          
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Room Name</th>
                  <th>Type</th>
                  <th>Rent per day</th>
                  <th>Max Count</th>
                  <th>Phone Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room._id}>
                    <td>
                      <div>
                        <strong className="text-primary">{room.name}</strong>
                        <br />
                        <small className="text-muted">{room._id}</small>
                      </div>
                    </td>
                    <td>{getTypeBadge(room.type)}</td>
                    <td>
                      <span className="fw-bold text-success">
                        ${room.rentperday}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-info">{room.maxcount}</span>
                    </td>
                    <td>{room.phonenumber}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => editRoom(room)}
                          icon={<i className="fas fa-edit me-1"></i>}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          type="primary"
                          danger
                          size="small"
                          onClick={() => deleteRoom(room._id)}
                          icon={<i className="fas fa-trash me-1"></i>}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {rooms.length === 0 && !loading && (
            <div className="text-center py-4">
              <i className="fas fa-hotel fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No rooms found</h5>
              <p>Add your first room using the "Add Room" tab</p>
            </div>
          )}

          {/* Edit Room Modal */}
          <Modal
            title={
              <span>
                <i className="fas fa-edit me-2"></i>
                Edit Room
              </span>
            }
            open={isEditModalVisible}
            onCancel={() => {
              setIsEditModalVisible(false);
              setEditingRoom(null);
              form.resetFields();
            }}
            footer={null}
            width={800}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleEditSubmit}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Room Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter room name' }]}
                  >
                    <Input prefix={<i className="fas fa-hotel"></i>} />
                  </Form.Item>
                  
                  <Form.Item
                    label="Rent Per Day ($)"
                    name="rentperday"
                    rules={[{ required: true, message: 'Please enter rent per day' }]}
                  >
                    <InputNumber 
                      min={1} 
                      style={{ width: '100%' }} 
                      prefix="$"
                    />
                  </Form.Item>
                  
                  <Form.Item
                    label="Max Count"
                    name="maxcount"
                    rules={[{ required: true, message: 'Please enter max count' }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                  
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter description' }]}
                  >
                    <Input.TextArea rows={3} placeholder="Enter room description..." />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    label="Phone Number"
                    name="phonenumber"
                    rules={[{ required: true, message: 'Please enter phone number' }]}
                  >
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                  
                  <Form.Item
                    label="Room Type"
                    name="type"
                    rules={[{ required: true, message: 'Please select room type' }]}
                  >
                    <Select>
                      <Option value="Deluxe">Deluxe</Option>
                      <Option value="Non-Deluxe">Non-Deluxe</Option>
                      <Option value="Suite">Suite</Option>
                      <Option value="Luxury">Luxury</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item label="Image URL 1" name="imageurl1">
                    <Input prefix={<i className="fas fa-image"></i>} />
                  </Form.Item>
                  
                  <Form.Item label="Image URL 2" name="imageurl2">
                    <Input prefix={<i className="fas fa-image"></i>} />
                  </Form.Item>
                  
                  <Form.Item label="Image URL 3" name="imageurl3">
                    <Input prefix={<i className="fas fa-image"></i>} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item className="text-end mb-0">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<i className="fas fa-save me-2"></i>}
                  size="large"
                >
                  Update Room
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </div>
    </div>
  );
}

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/users/getallusers');
      const list = Array.isArray(data) ? data : data.users || [];
      setUsers(list);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await axios.delete(`/api/users/deleteuser/${userId}`);
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
        fetchUsers();
      }
    } catch (error) {
      Swal.fire('Error!', 'Failed to delete user.', 'error');
      console.error(error);
    }
  };

  const toggleAdminStatus = async (userId, currentStatus) => {
    try {
      await axios.put(`/api/users/updateuser/${userId}`, {
        isAdmin: !currentStatus
      });
      Swal.fire('Success!', 'User admin status updated.', 'success');
      fetchUsers();
    } catch (error) {
      Swal.fire('Error!', 'Failed to update user.', 'error');
      console.error(error);
    }
  };

  const getAdminBadge = (isAdmin) => {
    return isAdmin ? 
      <span className="badge bg-success">Admin</span> : 
      <span className="badge bg-secondary">User</span>;
  };

  return (
    <div className="row">
      <div className="col-12">
        <Card className="shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">
              <i className="fas fa-users text-primary me-2"></i>
              Users Management
            </h4>
            <Button 
              type="primary" 
              onClick={fetchUsers}
              icon={<i className="fas fa-sync-alt me-2"></i>}
            >
              Refresh
            </Button>
          </div>
          
          {loading && <Loader />}
          {error && <Error />}
          
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th>User Info</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div>
                        <strong className="text-primary">{user.name}</strong>
                        <br />
                        <small className="text-muted">ID: {user._id}</small>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{getAdminBadge(user.isAdmin)}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <Button
                          type={user.isAdmin ? "default" : "primary"}
                          size="small"
                          onClick={() => toggleAdminStatus(user._id, user.isAdmin)}
                          icon={<i className={`fas ${user.isAdmin ? 'fa-user-times' : 'fa-user-shield'} me-1`}></i>}
                          className="me-2"
                        >
                          {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </Button>
                        <Button
                          type="primary"
                          danger
                          size="small"
                          onClick={() => deleteUser(user._id)}
                          icon={<i className="fas fa-trash me-1"></i>}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {users.length === 0 && !loading && (
            <div className="text-center py-4">
              <i className="fas fa-users fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No users found</h5>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export function Addroom() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError(null);

      const images = [values.imageurl1, values.imageurl2, values.imageurl3].filter(url => url && url.trim() !== "");
      const newroom = {
        name: values.name.trim(),
        rentperday: values.rentperday,
        maxcount: values.maxcount,
        description: values.description.trim(),
        phonenumber: values.phonenumber,
        type: values.type,
        imageurls: images
      };

      await axios.post('/api/rooms/addroom', newroom);
      
      Swal.fire({
        icon: 'success',
        title: "New room added successfully!",
        showConfirmButton: false,
        timer: 1500
      });

      form.resetFields();
    } catch (err) {
      console.log(err);
      setError(err);
      Swal.fire({
        icon: 'error',
        title: "Something went wrong!"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <Card className="shadow-sm">
          <div className="text-center mb-4">
            <h4 className="text-primary">
              <i className="fas fa-plus-circle me-2"></i>
              Add New Room
            </h4>
            <p className="text-muted">Fill in the details below to add a new room</p>
          </div>
          
          {loading && <Loader />}
          {error && <Error />}
          
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="p-4"
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Room Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter room name' }]}
                >
                  <Input 
                    prefix={<i className="fas fa-hotel"></i>} 
                    placeholder="Enter room name"
                    size="large"
                  />
                </Form.Item>
                
                <Form.Item
                  label="Rent Per Day ($)"
                  name="rentperday"
                  rules={[{ required: true, message: 'Please enter rent per day' }]}
                >
                  <InputNumber 
                    min={1} 
                    style={{ width: '100%' }} 
                    placeholder="Enter rent per day"
                    size="large"
                  />
                </Form.Item>
                
                <Form.Item
                  label="Maximum Guests"
                  name="maxcount"
                  rules={[{ required: true, message: 'Please enter maximum guest count' }]}
                >
                  <InputNumber 
                    min={1} 
                    style={{ width: '100%' }} 
                    placeholder="Enter maximum guests"
                    size="large"
                  />
                </Form.Item>
                
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[{ required: true, message: 'Please enter room description' }]}
                >
                  <Input.TextArea 
                    rows={4} 
                    placeholder="Enter room description..."
                    size="large"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  label="Phone Number"
                  name="phonenumber"
                  rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                  <InputNumber 
                    style={{ width: '100%' }} 
                    placeholder="Enter phone number"
                    size="large"
                  />
                </Form.Item>
                
                <Form.Item
                  label="Room Type"
                  name="type"
                  rules={[{ required: true, message: 'Please select room type' }]}
                >
                  <Select placeholder="Select room type" size="large">
                    <Option value="Deluxe">Deluxe</Option>
                    <Option value="Non-Deluxe">Non-Deluxe</Option>
                    <Option value="Suite">Suite</Option>
                    <Option value="Luxury">Luxury</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item label="Image URL 1" name="imageurl1">
                  <Input 
                    prefix={<i className="fas fa-image"></i>} 
                    placeholder="Enter image URL (optional)"
                    size="large"
                  />
                </Form.Item>
                
                <Form.Item label="Image URL 2" name="imageurl2">
                  <Input 
                    prefix={<i className="fas fa-image"></i>} 
                    placeholder="Enter image URL (optional)"
                    size="large"
                  />
                </Form.Item>
                
                <Form.Item label="Image URL 3" name="imageurl3">
                  <Input 
                    prefix={<i className="fas fa-image"></i>} 
                    placeholder="Enter image URL (optional)"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item className="text-center mt-4">
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                size="large"
                icon={<i className="fas fa-plus-circle me-2"></i>}
                style={{ minWidth: '200px' }}
              >
                Add Room
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}