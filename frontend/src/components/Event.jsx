import React,{useEffect,useState} from 'react'
import './Event.css'
import {  useNavigate,useParams } from 'react-router-dom'
import axios from 'axios'

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import API_URL from '../config/api';
import { getImageUrl } from '../../../backend/Utils/Imagehelper.js';

const Event = () => {
  const navigate=useNavigate();
  const { categ } = useParams();

const [filteredEvents, setFilteredEvents] = useState([]);
  // const [detail,setDetail]=useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);

   const [upcomingEvents, setUpcomingEvents] = useState([]);

  const featchevents=async()=>{
    try{
      //const res=await axios.get("http://localhost:5000/api/v1/admin/featch");
      const res=await axios.get(`${API_URL}/api/v1/admin/featch`);
      console.log("FULL RESPONSE:", res.data);
      setDetail(res.data);
    }
    catch(error)
    {
      console.log(error);
    }
  }
 
   //for upcoming events
  useEffect(() => {
  const fetchUpcomingEvents = async () => {
    try {
      const res = await axios.get(
        //"http://localhost:5000/api/v1/admin/upcoming-events"
        `${API_URL}/api/v1/admin/upcoming-events`
      );
      console.log(res.data.events);
      setUpcomingEvents(res.data.events);
    } catch (error) {
      console.log(error);
    }
  };

  fetchUpcomingEvents();
}, []);
console.log("Upcoming Events State:", upcomingEvents);
 /* useEffect(() => {
  featchevents();   
    const token = localStorage.getItem("token");
    console.log("TOKEN:", token); 
  
    if (token && token !== "null" && token !== "undefined") {
      setIsLoggedIn(true);
     
     } else {
      setIsLoggedIn(false); 
     }
}, []);*/

/*useEffect(() => {

  if (categ && detail.length > 0) {

    const searchText = String(categ)
      .trim()
      .toLowerCase();

    const filtered = detail.filter((info) => {

      const dbText = String(info.cate_nm)
        .trim()
        .toLowerCase();

      return dbText === searchText;

    });

    setFilteredEvents(filtered);

  } else {

    setFilteredEvents(detail);

  }

}, [categ, detail]);*/
useEffect(() => {

  const searchEvents = async () => {

    try {

      // IF SEARCH PARAM EXISTS
      if (categ) {

        const res = await axios.get(
          //`http://localhost:5000/api/v1/admin/search/${categ}`
          `${API_URL}/api/v1/admin/search/${categ}`
        );

           console.log("SEARCH DATA:", res.data);
        setFilteredEvents(res.data);

      } else {
          
          const res = await axios.get(
         // "http://localhost:5000/api/v1/admin/featch"
          `${API_URL}/api/v1/admin/featch`
        );

        setFilteredEvents(res.data);


      }

    } catch (error) {

      console.log(error);

    }

  };

  searchEvents();

}, [categ]);
  

  return (
    <>
         <div className='mains'>
             <div className="major">
                <p className="evntss"> EVENTS</p>
                <h3 style={{color:"pink"}}>Festival And Events</h3>
                <p className="fest"><a href="/" style={{color:"white"}}>Home    |     </a> Festival Events  Gallary</p>
                <h4 style={{color:"palegreen"}}>Events</h4>
              </div>
         </div>
         
         <div className='container'>
          
          {
            filteredEvents?.map((info,i)=>{
                 
                return(
                 <div key={i} className='event-card' >
              
         
              {
  info.image && (
    <img
     // src={`http://localhost:5000${info.image}`}
      // src={`${API_URL}${info.image}`}
     src={getImageUrl(info.image)} 
      height="300px"
      width="100%"
      alt="category"

      onClick={() => {

        const token = localStorage.getItem("token");

        if (
          !token ||
          token === "null" ||
          token === "undefined"
        ) {

        //  alert("Please login first");

         // navigate("/login");

         setShowModal(true);
          return;
        }

        // navigate(`/events/${info.cate_nm.toLowerCase()}`);
navigate(`/events/${encodeURIComponent(info.cate_nm.toLowerCase())}`);
      }}
      
    />
  )
}
                <h3 className='event-title'>
                          {info.cate_nm}</h3>
                
            </div>
                )
              
            })
           
          }
           
            
            </div>

            {/* <div className="upcoming-events-section">
  <div className="section-header">
    <h2>Upcoming Events</h2><br></br>
    <p>Events around you,book now</p>
  </div>

  <div className="event-slider">
    {upcomingEvents.map((item) => (
      <div
        key={item._id}
        className="event-slide-card"
        onClick={() => navigate(`/details/${item._id}`)}
      >
        <div className="event-image-wrapper">
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

          <span className="event-badge">Upcoming</span>
        </div>

        <div className="event-content">
          <h3>{item.title}</h3>

          <p>
            <i className="fa-solid fa-calendar-days"></i>
            {item.start_date}
          </p>

          <p>
            <i className="fa-solid fa-clock"></i>
            {item.start_time}
          </p>

          <p>
            <i className="fa-solid fa-location-dot"></i>
            {item.location}
          </p>

          <button className="view-btn">
            View Details
          </button>
        </div>
      </div>
    ))}
  </div>
</div> */}

<div className='upevent'>
  <h1>
    Upcoming Events
  </h1>
 
</div>
 <div className="upcoming">
        {upcomingEvents.length === 0 ? (
          <h2>No Events Found</h2>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            loop={upcomingEvents.length > 3}
            spaceBetween={25}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {upcomingEvents.map((evnt) => (
              <SwiperSlide key={evnt._id}>
                <div className="events-card">
                  {/* <img
                  src={
  evnt.image?.startsWith("/public/uploads/")
   // ? `http://localhost:5000/uploads/${evnt.image.replace("/public/uploads/","")}`
   ? `${API_URL}/${evnt.image.replace("/public/uploads/","")}`
    : evnt.image
}
                    alt={evnt.title}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/500x300?text=No+Image";
                    }}
                  /> */}

                  {/* <img
  src={
    evnt.image?.startsWith("/public/uploads/")
      ? `${API_URL}/uploads/${evnt.image.replace("/public/uploads/", "")}`
      : `${API_URL}${evnt.image}`
  }
  alt={evnt.title}
  onError={(e) => {
    console.log("Failed Image URL:", e.target.src);
  }}
/> */}
<img src={getImageUrl(evnt.image)} alt={evnt.title} />
                  <h1>{evnt.title}</h1>
                  
                  <p className="location">
                    <b>Start Time :</b> {evnt.start_time}<br></br>
                    <b>Start Date :</b> {evnt.start_date}<br></br>
                    <b>Location :</b> {evnt.location}
                  </p>
                  <p className="price">₹ {evnt.price}</p>

                 
                  <button
                    onClick={() => navigate(`/details/${evnt._id}`)}
                  >
                    View Detail
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
            {
  showModal && (

    <div className="login-modal-overlay">

      <div className="login-modal">

        <div className="modal-icon">
          <i className="fa-solid fa-lock"></i>
        </div>

        <h2>Please Login</h2>

        <p>
          You need to login first to view
          event details and book tickets.
        </p>

        <div className="modal-buttons">

          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login Now
          </button>

          <button
            className="cancel-btn"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>

  )
}
    </>
   
  )
}

export default Event;