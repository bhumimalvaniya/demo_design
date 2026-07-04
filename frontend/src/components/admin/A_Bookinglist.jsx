import React, { useEffect, useState } from 'react'
import "./A_Bookinglist.css";
import axios from 'axios';

const A_Bookinglist = () => {

  const [bookings, setBookings] = useState([]);
  const [currentpage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {

    const fetchBookings = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/v1/cust/showallbook",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Auto Expire Logic
        const updatedBookings = await Promise.all(
          res.data.data.map(async (item) => {

            const eventDate = new Date(item.event_id?.start_date);
            const today = new Date();

            // Remove time for proper comparison
            today.setHours(0, 0, 0, 0);
            eventDate.setHours(0, 0, 0, 0);

            // If event date is past
            if (eventDate < today && item.status !== "expired") {

              // Update in database
              await axios.put(
                `http://localhost:5000/api/v1/cust/updatestatus/${item._id}`,
                { status: "expired" },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              return {
                ...item,
                status: "expired"
              };
            }

            return item;
          })
        );

        setBookings(updatedBookings);

      } catch (err) {

        console.log(err);

      }
    };

    fetchBookings();


 
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  const indexOfLast = currentpage * itemsPerPage;

  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentItems = bookings.slice(indexOfFirst, indexOfLast);

  // Change Status
  const handleStatusChange = async (id, newStatus) => {

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/v1/cust/updatestatus/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, status: newStatus }
            : item
        )
      );

    } catch (error) {

      console.log(error);

    }
  };

  // Delete Booking
  const handleDelete = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/v1/cust/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings((prev) =>
        prev.filter((item) => item._id !== id)
      );

      alert("Booking Deleted Successfully");

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <>
    <div className='table-wrapper'>
      <table border={1} className='booking-table-container'>

        <thead>

          <tr>

            <th>No</th>
            <th>Ticket ID</th>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Event Title</th>
            <th>Time</th>
            <th>Event Date</th>
            <th>Booking Date</th>
            <th>Location</th>
            <th>Price</th>
            {/* <th>Status</th> */}
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {
            currentItems.map((booking, i) => (

              <tr
                key={booking._id}
                className={booking.status === "expired" ? "expired-row" : ""}
              >

                <td>{indexOfFirst + i + 1}</td>

                <td>{booking.ticketId}</td>

                <td>{booking.user?.fnm}</td>

                <td>{booking.user?.email}</td>

                <td>{booking.event_id?.cate_nm}</td>

                <td>
                  {new Date(booking.createdAt).toLocaleTimeString()}
                </td>

                <td>{booking.event_id?.start_date}</td>

                <td>
                  {new Date(booking.createdAt).toLocaleDateString()}
                </td>

                <td>{booking.location}</td>

                <td>{booking.price}</td>

             {/* <td>

                  <select
                  
                    value={booking.status}
                    disabled={booking.status === "expired"}
                    onChange={(e) =>
                      handleStatusChange(
                        booking._id,
                        e.target.value
                      )
                    }
                    className={`status-dropdown ${booking.status}`}
                  >

                    <option value="unconfirmed">
                      Unconfirmed
                    </option>

                    <option value="confirmed">
                      Confirmed
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>

                    <option value="processing">
                      Processing
                    </option>

                    <option value="expired">
                      Expired
                    </option>

                    <option value="pending">
                      Pending
                    </option>

                    <option value="approved">
                      Approved
                    </option>

                  </select>

                </td> */}

                <td>

                  <i
                    className="fa fa-trash"
                    style={{cursor:"pointer"}}
                    onClick={() => {

                      if (
                        window.confirm(
                          "Are you sure to delete booking?"
                        )
                      ) {
                        handleDelete(booking._id)
                      }

                    }}
                  ></i>

                </td>

              </tr>
            ))
          }

        </tbody>

      </table>
      </div>

      {/* Pagination */}

      <div
        style={{
          marginTop: "10px",
          display: "flex",
          gap: "8px",
          marginLeft: "220px",
          justifyContent: "center"
        }}
      >

        <button
          onClick={() =>
            setCurrentPage(prev => prev - 1)
          }
          disabled={currentpage === 1}
          style={{
            padding: "10px",
            paddingRight: "20px",
            paddingLeft: "20px",
            background: "green",
            color: "white",
            borderRadius: "15px",
            cursor:
              currentpage === 1
                ? "not-allowed"
                : "pointer",
            opacity:
              currentpage === 1
                ? 0.6
                : 1
          }}
        >

          <i
            className="fa fa-arrow-left"
            aria-hidden="true"
          ></i>

          {" "}Prev

        </button>

        {[...Array(totalPages)].map((_, i) => (

          <button
            key={i}
            onClick={() =>
              setCurrentPage(i + 1)
            }
            style={{
              background:
                currentpage === i + 1
                  ? "black"
                  : "white",

              color:
                currentpage === i + 1
                  ? "white"
                  : "black",

              border: "1px solid black",

              padding: "5px 10px",

              cursor: "pointer",

              borderRadius: "10px",
            }}
          >

            {i + 1}

          </button>

        ))}

        <button
          onClick={() =>
            setCurrentPage(prev => prev + 1)
          }
          disabled={currentpage === totalPages}
          style={{
            padding: "10px",
            paddingRight: "20px",
            paddingLeft: "20px",
            background: "green",
            color: "white",
            borderRadius: "15px",
            cursor:
              currentpage === totalPages
                ? "not-allowed"
                : "pointer",

            opacity:
              currentpage === totalPages
                ? 0.6
                : 1
          }}
        >

          Next{" "}

          <i
            className="fa fa-arrow-right"
            aria-hidden="true"
          ></i>

        </button>

      </div>

      <p
        style={{
          marginTop: 10,
          marginLeft: 220,
          textAlign: "center"
        }}
      >

        Page {currentpage} of {totalPages}

      </p>

    </>
  )
}

export default A_Bookinglist;