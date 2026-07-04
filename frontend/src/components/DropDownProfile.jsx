import React,{useState} from "react";
import "./DropDownProfile.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const DropDownProfile=()=>{
  const navigate=useNavigate();

  const hadleLogout=()=>{
    
    localStorage.removeItem("token"); //remove token
    sessionStorage.removeItem("user"); //remove username
   
    navigate("login");
  
    window.location.reload();
    
    window.dispatchEvent(new Event("userChanged"));
  }
    return(
        <>
        <div className='flex flex-col dropdownfile'>
          <ul className='flex flex-col gap-4'>
           <li><Link to={"/account"} style={{textDecoration:"none",color:"black"}}>Account</Link></li>
            <li><Link to={"/booking"} style={{textDecoration:"none",color:"black"}}>My Booking</Link></li>
            <li onClick={hadleLogout} style={{textDecoration:"none",color:"black"}}>Logout</li>

          </ul>
        </div>
        </>

    )
}

export default DropDownProfile;