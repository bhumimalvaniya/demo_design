import React, { useEffect, useState } from "react";
import "./Changedetail.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";

const Changedetail = () => {

  const[user,setUser]=useState(null);
  const [fnm, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [phone_no, setPhone] = useState("");
  
  const navigate=useNavigate();
  
  //  Fetch user data when page loads
useEffect(() => {
  const dataFetch = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        // "http://localhost:5000/api/v1/cust/getcurrentuser",
         `${API_URL}/api/v1/cust/getcurrentuser`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = res.data.data;

      setUser(userData);
      setName(userData.fnm);
      setEmail(userData.email);
      setGender(userData.gender);
      setPhone(userData.phone_no);

    } catch (error) {
      console.log(error);
    }
  };

  dataFetch();
}, []);


 // submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
       // "http://localhost:5000/api/v1/cust/updateuser",
        `${API_URL}/api/v1/cust/updateuser`,
        {
        fnm,
        email,
        gender,
        phone_no
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        
        }
        
      );
        navigate("/account");
      alert(res.data.message);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="change-user-container">
      <div className="form-card">
        <div className="form-icon">
          <i className="fa fa-lock"></i>
        </div>

        <h2>Change User Detail</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="name *"
            value={fnm}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Gender</label>
          <div className="gender-options">
            <label>
              <input
                type="radio"
                name="gender"
              checked={gender === "Female"}
                onChange={() => setGender("Female")}
              /> Female
            </label>

            <label>
              <input
                type="radio"
                name="gender"
                checked={gender === "Male"}
                onChange={() => setGender("Male")}
              /> Male
            </label>

            <label>
              <input
                type="radio"
                name="gender"
                checked={gender === "Other"}
                onChange={() => setGender("Other")}
              /> Other
            </label>
          </div>

          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="text"
            placeholder="phone number *"
            value={phone_no}
            onChange={(e) => setPhone(e.target.value)}
          />

          

          <button type="submit" className="change">
            CHANGE
          </button>
        </form>

        <p className="footer-text">
          Copyright © Your Website 2023
        </p>
      </div>
    </div>
  );
};

export default Changedetail;