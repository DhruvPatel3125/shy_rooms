import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

function ProfileScreen() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    window.location.href = "/login";
  }
  return (
    <>
      <div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Profile" key="1">
            <h1>Name:{user.name}</h1>
            <h1>Email:{user.email}</h1>
            <h1>isAdmin:{user.isAdmin ? "yes" : "no"}</h1>
          </TabPane>
          <TabPane tab="Bookings" key="2">
            <MyBookings />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}
export default ProfileScreen;

export function MyBookings() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching bookings for user:", user._id);

        const response = await axios.post("/api/bookings/getbookingsbyuserid", {
          userid: user._id,
        });

        console.log("Bookings response:", response.data);

        if (response.data.success) {
          setBookings(response.data.bookings);
        } else {
          setError(response.data.message || "Failed to fetch bookings");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch bookings"
        );
      } finally {
        setLoading(false);
      }
    };

    if (user && user._id) {
      fetchBookings();
    }
  }, []);

  const cancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/bookings/cancelbooking", {
        bookingid: bookingId,
        userid: user._id,
      });

      if (response.data.success) {
        // Refresh bookings after cancellation
        setBookings(
          bookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: "cancelled" }
              : booking
          )
        );
        Swal.fire({
          title: "Congrats",
          text: "Your booking has been cancelled successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else {
        Swal.fire({
          title: "Opps",
          text: "Somthing went wrong",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  if (bookings.length === 0) {
    return <div>No bookings found.</div>;
  }

  return (
    <div>
      <h2>My Bookings</h2>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}
              >
                Room
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}
              >
                Booking ID
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}
              >
                Check In
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}
              >
                Check Out
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}
              >
                Amount
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}
              >
                Status
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  {booking.room}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  {booking._id}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  {booking.fromdate}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  {booking.todate}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  ₹{booking.totalammount}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  <span
                    style={{
                      color: booking.status === "cancelled" ? "red" : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {booking.status || "Confirmed"}
                  </span>
                </td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  {(!booking.status || booking.status !== "cancelled") && (
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      style={{
                        backgroundColor: "#ff4d4f",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      disabled={loading}
                    >
                      Cancel Booking
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
