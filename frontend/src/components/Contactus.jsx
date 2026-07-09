import React from 'react'
import "./Contectus.css"
import axios from 'axios';
import { useState } from 'react';
import API_URL from '../config/api';


const Contactus = () => {
  const [formData,setFormData]=useState({
    fullname:"",
    email:"",
    phone:"",
    message:""
  })

  const  handlechange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
       // const res=await axios.post("http://localhost:5000/api/v1/cont/contect",formData);
        const res=await axios.post(`${API_URL}/api/v1/cont/contect`,formData);
        alert(res.data.message);
        setFormData({fullname:"",email:"",phone:"",message:""})
    }
    catch(error){
      alert(error.response?.data?.message||"something went wrong");
    }
  }
 

  return (
    <>
    <div className='cntpage'>
        <div className='contact'>
            <h3 className='cnt1'>CONTECT US NOW</h3>
        <h1 style={{color:"yellow"}}>KEEP </h1><h1>IN TOUCH</h1>
        <h4 style={{color:"white"}}><a href='/'>Home </a>       |       Contect us</h4>
    </div>
    </div>


<div className="form-container1">
        <div className="form-box1">
          <div className="icon1">🔒</div>
          <h2>Contact Us</h2>
          <form  onSubmit={handleSubmit} >
            <input
              type="name"
              name="fullname"
              placeholder="Name"
              required
              autoComplete="off"
              onChange={handlechange}
              value={formData.fullname}
            
            />
            <input
              type="email"
              name="email"
              placeholder="email"
              autoComplete="off"
              required
              onChange={handlechange}
              value={formData.email}
              
            />
            <input
              type="text"
              name="phone"
              placeholder="phone"
              required
               autoComplete="off"
               onChange={handlechange}
               value={formData.phone}
            />
            <input
              type="text"
              name="message"
              placeholder="message"
              required
              
              autoComplete="off"
                onChange={handlechange}
                value={formData.message}
            />

            <button type="submit">SEND</button>
          </form>
        </div>
      </div>
    
    </>
  )
}

export default Contactus;