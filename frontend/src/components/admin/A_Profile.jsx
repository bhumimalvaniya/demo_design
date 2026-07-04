import React from "react";
import './A_Profile.css';
import { Outlet,useNavigate } from "react-router-dom";
import profileImg from "../images/other.jpg"

 const A_Profile = () =>{
       const navigate=useNavigate();
    return(
         
        <>
            <div className="profile-section">
                
                    <div className="profile-img">
                        <img src={profileImg} alt="fsd" ></img>

                    </div>
            </div>
            <div className="btn-profile">
                <button className="pd" onClick={()=>navigate("/admin/profile")}>Personal Detail</button>
                <button className="cp" onClick={()=>navigate("/admin/profile/changepass")}>Change Password</button>
            </div>
        
    
             
                    <div className="profile-detail">
                        
                     <Outlet/>
            
                    </div>

                   
        
        
        </>
    )
}

export default A_Profile;