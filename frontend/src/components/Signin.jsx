import React from "react";
import "./Signin.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signin = () => {
  const [phone_no, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};

    if (!phone_no) {
      newErrors.phone_no = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(phone_no)) {
      newErrors.phone_no = "Phone number must be 10 digits";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handelsubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    console.log("Sending login request:", { phone_no, password });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/cust/login",
        { phone_no, password }
      );

      console.log("response:",res.data);
      alert(res.data.message);  

      if (res.data.user) {
        //save token
        localStorage.setItem("token", res.data.token);
        //save user info
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            fnm: res.data.user.fnm,
            phone_no:res.data.user.phone_no,
            email:res.data.user.email,
            gender: res.data.user.gender,
            avatar:res.data.user.avatar
          })
        );
      }

      // update header instantly
    window.dispatchEvent(new Event("userChanged"));

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login">
      <div className="form-box">
        <div className="icon3">🔒</div>
        <h2>Sign In</h2>

        <form onSubmit={handelsubmit}>
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={phone_no}
            onChange={(e) => setPhone(e.target.value)}
          />
          <small className="error">{errors.phone_no}</small>

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <small className="error">{errors.password}</small>

          <button type="submit">SIGN IN</button>

          <div className="links">
            <Link to="/forget">Forgot Password?</Link>
            <p>
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;