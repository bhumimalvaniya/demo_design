import React, { useState } from "react";
import "./Changepass.css"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";

const Changepass=()=>{
    const [password,setPassword]=useState("");
    const [newPassword,setNewPassword]=useState("");
    const navigate=useNavigate();
    const[error,setErrors]=useState({});
  

    const validate = () => {
  let newErrors = {};

  if (!password) {
    newErrors.password = "Old password is required";
  }

  if (!newPassword) {
    newErrors.newPassword = "New password is required";
  } else if (newPassword.length < 6) {
    newErrors.newPassword = "Password must be at least 6 characters";
  }  else if (!/[0-9]/.test(newPassword)) {
    newErrors.newPassword = "Must include at least one number";
  }

 

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
    const handlechange=async(e)=>{
      e.preventDefault();

      if (!validate()) return; 

 const user = JSON.parse(sessionStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      return;
    }

    try {

      const token = localStorage.getItem("token");
      const res = await axios.post(
       // "http://localhost:5000/api/v1/cust/changepass",
        `${API_URL}/api/v1/cust/changepass`,
        {
          email: user.email,
          password,
          newPassword,
        },
        {
    headers: {
      Authorization: `Bearer ${token}`,
    }
    },
      );

      
      alert(res.data.message);

       sessionStorage.removeItem("user");
       localStorage.removeItem("token");

      setPassword("");
      setNewPassword("");

      navigate("/login");
      window.location.reload();
          
    } catch (error) {
      alert(error.response?.data?.message || "Error changing password");
    }
       
      
    }   
    
    return(
       <div>
      {/* Top Banner Section */}
        <div className='change'>
        <div className='chpass'>
            <h3 className='ch1'>CONTECT US NOW</h3>
        <h1 style={{color:"yellow"}}>KEEP </h1><h1>IN TOUCH</h1>
        <h4 style={{color:"white"}}><a href='Home'>Home </a>       |       Contect us</h4>
    </div>
    </div> 
        <div className="form-container">
        <div className="form-box">
          <div className="icon">🔒</div>
          <h2>Change Password</h2>
          <form  onSubmit={handlechange}>
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              placeholder="Current password *"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
             
            />
            {error.password && <p className="error">{error.password}</p>}

            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password *"
              value={newPassword}
              onChange={(e)=>setNewPassword(e.target.value)}
           
            />
              {error.newPassword && <p className="error">{error.newPassword}</p>}
            <button type="submit">CHANGE</button>
          </form>
        </div>
      </div>
      </div>
    
    )
}

export default Changepass;