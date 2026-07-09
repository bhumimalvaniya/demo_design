    import React, { useEffect, useState } from 'react'
    import './Events.css'
    import { useNavigate } from 'react-router-dom'
    import { useParams } from 'react-router-dom'
    import axios from 'axios'
    import API_URL from '../config/api'
        
    const Events = () => {
        const {categ}=useParams();
        const navigate=useNavigate();
        const [events,setEvents]=useState([]);

        useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
         // `http://localhost:5000/api/v1/admin/search/${categ.toLowerCase()}`,
          `${API_URL}/api/v1/admin/search/${categ.toLowerCase()}`,
        );

        console.log("Events Data:", res.data);

        // Fix image URLs
        const eventsWithFixedImages = res.data.map(event => ({
          ...event,
          image: event.image?.startsWith('/public/uploads/') 
            //? `http://localhost:5000/uploads/${event.image.replace('/public/uploads/', '')}` 
            ? `${API_URL}/uploads/${event.image.replace('/public/uploads/', '')}` 
            : event.image
        }));

        setEvents(eventsWithFixedImages);
      } catch (error) {
        console.log("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [categ]);
     
      return (
     <>
        <div className='main'>
             <div className="major">
                <p className="evntss"> EVENTS</p>
                <h3>Festival And Events</h3>
                <p className="fest"><a href="/">Home    |     </a> Festival Events  Gallary</p>
                <h4>Events</h4>
              </div>
         </div>
        <div className='main2'>
  {events.length === 0 ? (
    <p>No events found</p>
  ) : (
    events.map((evnt) => (
      
      <div className="events-card" key={evnt._id}>

        {/* IMAGE */}
        <img
          src={evnt.image}
          alt={evnt.title}
          onError={(e) => {
            e.target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
        />

        {/* TITLE */}
        <h1>{evnt.title}</h1>

        {/* PRICE */}
        <p className="price">₹ {evnt.price}</p>

        {/* LOCATION */}
        <p className="location">
          <b>Location :</b> {evnt.location}
        </p>

        {/* BUTTON */}
        <p>
          <button
            onClick={() => navigate(`/details/${evnt._id}`)}
          >
            View Detail
          </button>
        </p>

      </div>

    ))
  )}
</div>
         
     </>
      )
    }
    
    export default Events;