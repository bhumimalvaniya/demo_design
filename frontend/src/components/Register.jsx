import React, { useState } from "react";
import axios from "axios";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fnm: "",
    email: "",
    gender: "",
    phone_no: "",
    password: "",
     conpass:"",
    avatar:null,
   
  });

  const [errors, setErrors] = useState({});

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
     if (e.target.name === "avatar") {
      setFormData({ ...formData, avatar: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
 
  };

  //  VALIDATION FUNCTION
  const validate = () => {
    let newErrors = {};

    if (!formData.fnm || formData.fnm.length < 3) {
      newErrors.fnm = "Full name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select gender";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone_no)) {
      newErrors.phone_no = "Phone number must be 10 digits";
    }

    const passRegex = /^(?=.*[0-9]).{6,}$/;
    if (!passRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 6 characters and include a number";
    }

    if(!formData.conpass)
    {
      newErrors.conpass="confirm password is required";
    }
    else if(formData.password!==formData.conpass)
    {
      newErrors.conpass="password do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    console.log(formData);
    
    try {
      const res = await axios.post(
       // "http://localhost:5000/api/v1/cust/register",
        `${API_URL}/api/v1/cust/register`,
        formData
      );
      alert(res.data.message);
      setFormData({
        fnm: "",
        email: "",
        gender: "",
        phone_no: "",
        password: "",
       conpass:""
      });
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="register">
      <div className="form-box">
        <div className="icon">🔒</div>
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fnm"
            placeholder="Enter Full Name "
            value={formData.fnm}
            onChange={handleChange}
          />
          <small className="error">{errors.fnm}</small>

          <input
            type="email"
            name="email"
            placeholder="Enter Email "
            value={formData.email}
            onChange={handleChange}
          />
          <small className="error">{errors.email}</small>

          <div className="radio1">
            <input
              type="radio"
              name="gender"
              value="female"
              onChange={handleChange}
            />
            <label>Female</label>

            <input
              type="radio"
              name="gender"
              value="male"
              onChange={handleChange}
            />
            <label>Male</label>

            <input
              type="radio"
              name="gender"
              value="other"
              onChange={handleChange}
            />
            <label>Other</label>
          </div>
          <small className="error">{errors.gender}</small>

          <input
            type="text"
            name="phone_no"
            placeholder="Enter Phone Number "
            value={formData.phone_no}
            onChange={handleChange}
          />
          <small className="error">{errors.phone_no}</small>

          <input
            type="password"
            name="password"
            placeholder="Enter Password "
            value={formData.password}
            onChange={handleChange}
          />
          <small className="error">{errors.password}</small>

          <input
            type="password"
            name="conpass"
            placeholder="Enter Confirm Password"
            value={formData.conpass}
            onChange={handleChange}
          />
          <small className="error">{errors.conpass}</small>
          <button type="submit">SIGN UP</button>

          <p>
            Already have an account? <a href="/login" style={{color:"blue"}}>Sign In</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;