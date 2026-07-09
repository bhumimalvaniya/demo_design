import React from "react";
import "./Adminlogin.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config/api";

const Adminlogin = () => {

  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const navigate=useNavigate();
  const [error,setError]=useState({});

  const validate=()=>{
    let errors={};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailRegex) 
      {
      errors.email = "Enter a valid email address";
    }
   


    if(!password)
    {
      errors.password="password is required";
    }
    else if(password.length<6)
    {
      errors.password="password must be at least 6 charachters";
    }
   
       setError(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handlesubmit=async(e)=>{
    e.preventDefault();
    if (!validate()) return;

    try{
      // const res=await axios.post("http://localhost:5000/api/v1/admin/login",{email,password});
       const res=await axios.post(`${API_URL}/api/v1/admin/login`,{email,password});
      if(res.data.success===true)
      {
         sessionStorage.setItem("adminToken",res.data.token);
         sessionStorage.setItem("adminName",res.data.admin.name);
         
          alert(res.data.message);
        navigate("/admin");
      }
      else{
        alert(res.data.message);
      }
      

    }
    catch(err)
    {
      if(err.response){
        alert( err.response.data.message);

      }
      else{
        alert("server not responding");
      }
    }
    
  }
  

  return (
     <div className="login-page">
      <div className="login-box">
        <div className="lock-icon">🔒</div>
        <h2>LOGIN</h2>
        <form onSubmit={handlesubmit}>
        <input 
        type="email"
        placeholder="Email" 
        name="email"
        autoComplete="off"
          onChange={(e)=>setEmail(e.target.value)}
      />
      <small className="err">{error.email}</small>

        <input
         type="password" 
         placeholder="Password" 
         name="password"
         onChange={(e)=>setPassword(e.target.value)}
        />
         <small className="err">{error.password}</small>
        
        <div className="rememberadmin">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember">Remember me ?</label>
        </div>

        <button className="login-btn">Log in</button>
          </form>
      </div>
    </div>
  );
};

export default Adminlogin;
