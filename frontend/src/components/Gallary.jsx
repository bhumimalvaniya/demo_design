  import React from "react";
  import './Gallary.css';
  import { useEffect,useState } from "react";
  import axios from "axios";
  import API_URL from "../config/api";


  const Gallary=()=>{
    const[images,setImages]=useState([]);
    const[selectedImage,setSelectedImage]=useState(null);

    useEffect(() => {
      const fetchGallary = async () => {
        try {
          const res = await axios.get(
          // `http://localhost:5000/api/v1/gallary/featch`,
            `${API_URL}/api/v1/gallary/featch`,
          );

          console.log("Gallary Data:", res.data);

          // Fix image URLs
          const GallaryWithFixedImages = res.data.map(gallary => ({
            ...gallary,
            image: gallary.image?.startsWith('/public/uploads/') 
            // ? `http://localhost:5000/uploads/${gallary.image.replace('/public/uploads/', '')}` 
            ? `${API_URL}/uploads/${gallary.image.replace('/public/uploads/', '')}` 
              : gallary.image
          }));

          setImages(GallaryWithFixedImages);
        } catch (error) {
          console.log("Error fetching events:", error);
        }
      };

      fetchGallary();
    }, []);


    const handleDelete = async (id) =>{
                      try {
              //await axios.delete(`http://localhost:5000/api/v1/gallary/delete/${id}`);
              await axios.delete(`${API_URL}/api/v1/gallary/delete/${id}`);
              setImages(images.filter(c => c._id !== id));
                      }
                      catch(error)
                      {
                        console.log(error);
                      }
                  }

                  
      return(
          <>
              <div  className="back-img">
                <div className="hrmny">
                  <p className="evnt">HARMONI EVENTS</p>
                  <h3>HARMONI</h3>
                  <p className="galary"><a href="/" >Home    |     </a> Harmoni Gallary</p>
                  <h4>GALLARY</h4>
                </div>
              </div>
            
              <div className="des">
                  <p>------★★Our Gallary★★------</p>
              </div>

            <div className="gallary-grid">
              {
                images.map((img,index)=>
                  <div className="gallary-card" key={index} 
                    onClick={() => {
      console.log("card clicked");
      setSelectedImage(img.image);
    }}
                  >
              {img.image &&
              (<img src={img.image}
                alt={img.photo_name}
                  onClick={() => setSelectedImage(img.image)}
                  className="gallery-img"
                onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                  />
                  )}
      <div className="overlay">
        <div className="text">
          <h3>{img.photo_name}</h3>
          
          <p>shell there</p>
        </div>
        <span className="info">i</span>
      </div>
    </div>
    
                )
              }
  

    
    

  </div>

          <div className="des">
                  <p>★★Your Location★★</p>
              </div>

              
              <div className="map">
                <iframe src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d117492.23251653841!2d72.42947059559951!3d23.037270561296786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x395e9b4922484c6f%3A0xe077cfffcd90ee87!2s406%2C%20Akshat%20Complex%2C%20Sarkhej%20-%20Gandhinagar%20Hwy%2C%20near%20pakwan%20hotel%2C%20opp.%20Rajpath%20Rangoli%20Road%2C%20Ahmedabad%2C%20Gujarat%20380015!3m2!1d23.0372919!2d72.5118722!5e0!3m2!1sen!2sin!4v1756960426582!5m2!1sen!2sin" 
                width="100%" 
                height="250" 
                style={{border:0}}
                loading="lazy" 
                >

                </iframe>
                  
              </div>

            {/* <div className="banner1">
        <h2 className="banner-text">
          30% Off In June~July For Birthday Events
        </h2>
        <button className="banner-button">MAKE AN EVENT NOW</button>
      </div>
      */}
  {/* popup image code */}
      {
  selectedImage && (
    <div className="image-popup">

      <div className="popup-box">

        <button 
          className="close-btn"
          onClick={()=>setSelectedImage(null)}
        >
          ×
        </button>

        <img 
          src={selectedImage}
          alt="preview"
        />

      </div>

    </div>
  )
  }
          </>
      )
  }

  export default Gallary;