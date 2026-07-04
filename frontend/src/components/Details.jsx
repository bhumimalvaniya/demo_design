import React from 'react'
import './Details.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect,useState } from 'react'
import axios from 'axios'

const Details = () => {
  const {id}=useParams();
  const[event,setEvents]=useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate=useNavigate();
  const [quantity, setQuantity] = useState(1);
 
  const [expiredEvents,setExpiredEvents] = useState([]);

   const loadScript = (src) => {
    return Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

 
 const displayRazorpay = async (amount, event_id) => {

  const token = localStorage.getItem("token");

  // Check Login
  if (!token) {

    alert("Please login first");

    navigate("/login");

    return;
  }

  // try {

  //   // Check Existing Booking
  //   const bookingCheck = await axios.get(
  //     "http://localhost:5000/api/v1/cust/getbook/:id",
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );

  //   // Find already booked event
  //   const alreadyBooked = bookingCheck.data.data.find(
  //     (item) => item.event_id?._id === event_id
  //   );

  //   // If already booked
  //   if (alreadyBooked) {

  //     alert("Already booked this event");

  //     return;
  //   }

  // } catch (error) {

  //   console.log(error);

  // }

  // Load Razorpay
  const res = await loadScript(
    "https://checkout.razorpay.com/v1/checkout.js"
  );

  if (!res) {

    alert("You are offline");

    return;
  }

  const option = {

    key: "rzp_test_dEYhZg38SrkYMD",

    currency: "INR",

    amount: amount * quantity * 100,

    name: "Event Booking",

    description: "Thanks for booking from our website",

    image:
      "https://res.cloudinary.com/dtdlad1ud/image/upload/v1707733051/uhwydfqry5wqwkaazbbk.jpg",

    handler: async function (response) {

      console.log("Payment Success:", response);

      try {

        const res = await axios.post(
          "http://localhost:5000/api/v1/cust/booking",
          { event_id ,quantity},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(res.data.message);

        window.location.href = "/booking";

      } catch (err) {

        console.log(
          "Booking Error:",
          err.response?.data || err.message
        );

        alert(
          err.response?.data?.message ||
          "Booking Failed"
        );
      }
    },

    prefill: {
      name: "",
    },
  };

  
  const paymentObject = new window.Razorpay(option);

  paymentObject.open();
};

  useEffect(()=>{
    axios
        .get(`http://localhost:5000/api/v1/admin/details/${id}`)
      .then((res) => {
        console.log("Event Details:", res.data);
        
        // Fix image URL
        const eventWithFixedImage = {
          ...res.data,
          image: res.data.image?.startsWith('/public/uploads/') 
            ? `http://localhost:5000/uploads/${res.data.image.replace('/public/uploads/', '')}` 
            : res.data.image,

            //multiple images code 
          /*   galleryImages: res.data.galleryImages?.map((img) =>
    img.startsWith("/public/uploads/")
      ? `http://localhost:5000/uploads/${img.replace("/public/uploads/", "")}`
      : img
  ) || []*/
        };
        
        setEvents(eventWithFixedImage);
        console.log("Event Details:", res.data);
// console.log("Gallery Images:", res.data.galleryImages);
      })
        .catch(err=>console.log(err))
        
  },[id]);

  
 
 //for expired events
//  useEffect(() => {
//   const fetchExpiredEvents = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:5000/api/v1/admin/expired-events"
//       );

//       setExpiredEvents(res.data.events);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   fetchExpiredEvents();
// }, []);
// console.log("expired Events State:", expiredEvents);
useEffect(() => {
  if (!event) return;

  const fetchExpiredEvents = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/admin/expiredevents/${event.cate_nm}`
      );

      const data = res.data.map((item) => ({
        ...item,
        image: item.image?.startsWith("/public/uploads/")
          ? `http://localhost:5000/uploads/${item.image.replace(
              "/public/uploads/",
              ""
            )}`
          : item.image,
      }));

      setExpiredEvents(
        data.filter((item) => item._id !== event._id)
      );

    } catch (error) {
      console.log(error);
    }
  };

  fetchExpiredEvents();

}, [event]);
 if (!event) {
    return <h2>No events found</h2>;
  }

  return (
    <>
     
       <div className="adet">

  {/* IMAGE */}
  <img
    src={event.image}
    alt={event.title}
  />

  <div className="details-content">

    {/* TOP */}
    <div className="top-section">

      <div>
        <h1>{event.title}</h1>

        <h3>₹ {event.price}</h3>
      </div>

     <div className="ticket-qty">
  <button
    onClick={() =>  setQuantity(quantity > 1 ? quantity - 1 : 1)}
  >
    -
  </button>

  <span>{quantity || 1}</span>

  <button
    onClick={() =>  setQuantity(quantity + 1)}
  >
    +
  </button>
</div>
      <button
        className="btn1"
        onClick={() =>
          displayRazorpay(event.price, event._id)
        }
      >
        Book Ticket
      </button>

    </div>

    {/* DESCRIPTION */}
    <p className="ind">
      {event.description}
    </p>

    {/* TITLE */}
    <h2 className="section-title">
      When & Where
    </h2>
        <p> {event.location}</p>
    {/* GRID */}
    <div className="info-grid">

      {/* START */}
      <div className="info-card">

        <i className="fa-solid fa-calendar-days"></i>

        <h4>Start Date & Time</h4>

        <p>📅 {event.start_date}</p>

        <p>⏰ {event.start_time}</p>

      </div>

      {/* END */}
      <div className="info-card">

        <i className="fa-solid fa-clock"></i>

        <h4>End Date & Time</h4>

        <p>📅 {event.end_date}</p>

        <p>⏰ {event.end_time}</p>

      </div>

    </div>

    {/* LOCATION */}
    <div className="location-box">

      <i className="fa-solid fa-location-dot"></i>

      <h4>Location</h4>

       <a
    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="location-link"
  >
    {event.location}
  </a>

    </div>

  </div>


  {/* <div className="expired-events-section">
  <h2>Expired Events</h2>

  <div className="expired-events-grid">
    {expiredEvents
        .filter((item)=>item._id !== id)
        .map((item) => (
      <div
        key={item._id}
        className="expired-event-card"
        onClick={() => navigate(`/details/${item._id}`)}
      >
        <img
          src={
            item.image?.startsWith("/public/uploads/")
              ? `http://localhost:5000/uploads/${item.image.replace(
                  "/public/uploads/",
                  ""
                )}`
              : item.image
          }
          alt={item.title}
        />

        <h3>{item.title}</h3>

        <p>{item.start_date}</p>

        <p>{item.start_time}</p>

        <p>{item.location}</p>
      </div>
    ))}
  </div>
  </div> */}

  <div className='expired-header'>
    <h3>Expired Events</h3>
  </div>
  <div className="expired-main">
  {expiredEvents.length === 0 ? (
    <p>No expired events found.</p>
  ) : (
    expiredEvents.map((evnt) => (
      <div className="events-card expired-cards" key={evnt._id}>
        <img src={evnt.image} alt={evnt.title} />

        {/* <h1>{evnt.title}</h1>

        <p>₹ {evnt.price}</p>

        <p>
          <b>Location:</b> {evnt.location}
        </p>

        <button disabled>
          Event Expired
        </button> */}
      </div>
    ))
  )}
</div>

{/* <h2 className="gallery-title">
  Event Gallery
</h2>

<div className="event-gallery">

  {event.galleryImages?.length > 0 ? (

    event.galleryImages.map((img, index) => (

      <div
        className="gallery-card"
        key={index}
      >
        <img
          src={img}
          alt={`gallery-${index}`}
          onClick={() => setSelectedImage(img)}
        />

      </div>

    ))

  ) : (

    <h3>No Gallery Images Available</h3>

  )}

</div> */}
</div>



{selectedImage && (
  <div
    className="image-popup"
    onClick={() => setSelectedImage(null)}
  >

    <div
      className="popup-content"
      onClick={(e) => e.stopPropagation()}
    >

      <button
        className="close-btn"
        onClick={() => setSelectedImage(null)}
      >
        ×
      </button>

      <img
        src={selectedImage}
        alt="preview"
      />

    </div>

  </div>
)}
 
    </>
    
  )
}

export default Details;

