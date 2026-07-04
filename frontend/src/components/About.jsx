import React,{useEffect,useState} from 'react'
import './About.css'
import axios from "axios"

const About = () => {

  const[aboutData,setAboutData]=useState([]);

  useEffect(()=>{
    fetchAbout();
  },[]);

  const fetchAbout=async()=>{
    try{
      const res=await axios.get("http://localhost:5000/api/v1/admin/getabout");
      console.log(res.data);
      setAboutData(res.data);

    }
    catch(err)
    {
      console.log(err);
    }
  }


  return (
   <>

      <div>

      {/* HERO SECTION */}
      <div className="hero-section">
        <div className="hero-content">
          <p>ALL YOU NEED TO</p>
          <h3>KNOW</h3>
          <h1>ABOUT</h1>
          <h2>HARMONI</h2>
          <span><a href="/">Home</a> | About Us</span>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div className="about-container">

        <div className="about-left">
          <p>We are harmoni</p>
          <h2>No.1 Events Management</h2>
          <button>Get Started!</button>
        </div>

        <div className="about-right">

          <div className="box">
            <h3>Our Mission</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem, ratione.
            </p>
          </div>

          <div className="box">
            <h3>Our Vision</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem, ratione.
            </p>
          </div>

        </div>

      </div>

    </div>

   <div className="card-section">
   {
   aboutData.length === 0 ? (
          <h2>No Data Found</h2>
        ) :(aboutData.map((item, index) => (
    <div className="cards" key={index}>
      <h4>{item.title}</h4>
      <p>
        {item.description}
      </p>
    </div>
  )))}
</div>
   </>
  )
}

export default About;