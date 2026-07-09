import React from "react";
import './A_Personaldetail.css';
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import API_URL from "../../config/api";

const A_Personaldetail=()=>{

  const[data,setData]=useState(null);
  const[fullName,setFullName]=useState("");
  const[email,setEmail]=useState("");

 useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = sessionStorage.getItem("adminToken");
       console.log("token:",token);

      const res = await axios.get(
        // "http://localhost:5000/api/v1/admin/getadminprofile",
         `${API_URL}/api/v1/admin/getadminprofile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("full response:",res.data);

      const admindata=res.data.data  || res.data.admin || res.data;

      if (!admindata) {
  console.log("No admin data found");
  return;
}
     
      setFullName(admindata.name);
      setEmail(admindata.email);

    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
    }
  };

  const updateProfile = async (e) => {
  e.preventDefault();

  try {
    const token = sessionStorage.getItem("adminToken");
   console.log("token:", token);
   
    console.log("Sending:", { fullName, email });
    await axios.put(
     // "http://localhost:5000/api/v1/admin/updateadminprofile",
      `${API_URL}/api/v1/admin/updateadminprofile`,
      {  name:fullName, email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    

    alert("Profile updated successfully");

    sessionStorage.setItem("adminName", fullName);

  } catch (error) {
   console.log("UPDATE ERROR:", error.response?.data || error.message);
  }
};

    return(
        <>
               <div className="profile-container">
      <h2>Personal Details</h2>
      <form className="profile-form" onSubmit={updateProfile}>
        <label>Full Name:
        <input
          name="fullName"
          value={fullName}
           onChange={(e) => setFullName(e.target.value)}
        />
        </label>
        <label>Email Address:
        <input
          name="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        </label>
        <button >Update</button>
      </form>
    </div>
        </>
    )

}

export default A_Personaldetail;