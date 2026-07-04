import React, { useState } from "react";
import './Forgetpass.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Forgetpass = () => {

  const [phone_no, setPhone] = useState("");
  const [otp,setotp]=useState("");
  const[step,setstep]=useState(1);

  const navigate = useNavigate();

  const sendOTP = async (e) => {

    e.preventDefault();

    //  validation
    if (!phone_no || phone_no.length !== 10) {
      alert("Enter valid 10-digit mobile number");
      return;
    }

   try {
      await axios.post("http://localhost:5000/api/v1/cust/send-otp", { phone_no });
      alert("OTP sent");
      setstep(2);
    } catch (err) {
       alert(err.response?.data?.message || "Error sending OTP");
    }
  };

   const verifyOtp = async () => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/v1/cust/verify-otp",
      { phone_no, otp }
    );

    if (res.data.success) {
      alert("OTP Verified");
      //  navigate to reset password with phone_no
      navigate("/resetpassword", { state: { phone_no } });
    } else {
      alert(res.data.message || "Invalid OTP");
    }
  } catch (err) {
    alert("Invalid OTP");
  }
};
  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <div className="icon-wrapper">
          <i className="fa fa-lock"></i>
        </div>

        <h3>Forgot password</h3>

        <form onSubmit={sendOTP}>
          {step===1 && (
            <>
               <input
            type="text"
            placeholder="mobile number*"
            className="mobile-input"
            value={phone_no}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button type="submit" className="otp-btn">
            SEND OTP
          </button>
            </>
          )}
         
          {step === 2 && (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setotp(e.target.value)}
          />
          <button type="button" className="verify-btn" onClick={verifyOtp}>
            VERIFY OTP
            </button>
        </>
      )}
          
        </form>
      </div>
    </div>
  );
};

export default Forgetpass;