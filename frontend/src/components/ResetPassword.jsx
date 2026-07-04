import React, { useState } from "react";
import './Forgetpass.css'; // same css
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ get phone_no from OTP page
  const phone_no = location.state?.phone_no;

  const handleReset = async (e) => {
    e.preventDefault();

    // ✅ validations
    if (!password) {
      alert("Please enter new password");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/cust/resetpassword",
        { phone_no, password }
      );

      if (res.data.success) {
        alert("Password reset successfully");
        navigate("/login"); // ✅ go to login
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <div className="icon-wrapper">
          <i className="fa fa-lock"></i>
        </div>

        <h3>Reset Password</h3>

        <form onSubmit={handleReset}>

          <input
            type="password"
            placeholder="Enter new password*"
            className="mobile-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm new password*"
            className="mobile-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" className="otp-btn">
            RESET PASSWORD
          </button>

          <p
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer", color: "blue", marginTop: "10px" }}
          >
            Back to Login
          </p>

        </form>
      </div>
    </div>
  );
};

export default ResetPassword;