import React,{useEffect,useState} from "react";
import axios from "axios";
import "./Booking.css";

const Bookings = () => {
  const [booking,setBookings]=useState([]);
 
  
  const featchbookings=async()=>{
     try {
      
       const token = localStorage.getItem("token"); 
       console.log("Token:",token);
    const res = await axios.get(`http://localhost:5000/api/v1/cust/getbook/:id`,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
    );

      console.log("API Response:", res.data);
  


    setBookings(res.data.data );
   

  } catch (error) {
   console.log("Error:", error.response?.data || error.message);
    
  }

  
  }
  useEffect(()=>{
    featchbookings();

     // Auto Refresh every 5 seconds
  const interval = setInterval(() => {

    featchbookings();

  }, 9000);

  // Cleanup
  return () => clearInterval(interval);

  },[])

   
const getCurrentDate = () => {
  return new Date().toLocaleDateString();
};
 
const getCurrentTime = () => {
  return new Date().toLocaleTimeString();
};

  const handleDelete = async (id) => {
  console.log("Deleting ID:", id);
  try {
    const token = localStorage.getItem("token"); //  get token
    await axios.delete(`http://localhost:5000/api/v1/cust/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, //  send token
      },
    });
    setBookings(booking.filter(b => b._id !== id)); //  update UI
  } catch (error) {
    console.log("Delete error:", error.response?.data || error.message); //  better log
  }
};

  return (
    <div className="booking-container">

      
      {booking.length === 0 ? (
        <h2>No bookings found</h2>
      ) : (
        booking.map((b) => (
        <div
          key={b._id}
         className="booking-card"
          // className={`booking-card ${b.status === "expired" ? "expired-card" : ""}`}
        >
          <div className="qr-section">
          <img 
  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${b._id}`} 
  alt="QR Code" 
/>
</div>
          <div className="ticket-id">
          <p><strong>Ticket ID:</strong> {b.ticketId}</p>
          </div>
          <div className="booking-details">
          <p><strong>Date & Time:</strong> {new Date(b.createdAt).toLocaleString()}</p>
          <p><strong>Booking Date:</strong>{b.bookingDate}</p>
          <p><strong>Location:</strong> {b.location}</p>
          <p><strong>Event Title:</strong> {b.event_id?.cate_nm}</p>
          <p><strong>Price:</strong> ₹ {b.price}</p>
          {/* <p><strong>Status:</strong>{b.status}</p> */}
          <p><strong>Tickets:</strong> {b.quantity}</p>
          <p><strong>Total:</strong> ₹ {(b.price * (b.quantity))}</p>

          </div>
          <button
            onClick={() => handleDelete(b._id)}
            // disabled={b.status === "expired"}
  // className={b.status === "expired" ? "disabled-btn" : "delete-btn"}
            style={{
              background: "blue",
              color: "white",
              padding: "6px 12px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))
   ) }
    </div>
  );
};

export default Bookings;
