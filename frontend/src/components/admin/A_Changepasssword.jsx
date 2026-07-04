import React, { useState } from "react";
import "./A_Changepassword.css";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const A_Changepassword = () => {
  const [password, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  if (!confirmPassword) {
    newErrors.confirmPassword = "Confirm password is required";
  } else if (newPassword !== confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
  const handlesubmit = async (e) => {
    e.preventDefault();

if (!validate()) return; 

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

   
    const token = sessionStorage.getItem("adminToken");
   

    try {
      const res = await axios.put(
        "http://localhost:5000/api/v1/admin/changepassword",
        {
          password,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

     
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      navigate("/admin/adminlogin");
      
    } catch (error) {
  console.log("ERROR FULL:", error.response);
  console.log("ERROR DATA:", error.response?.data);
  alert(error.response?.data?.message || error.message);
}
  };

  return (
    <div className="change-password-container">
      <h3>Change Password</h3>

      <form className="password-form" onSubmit={handlesubmit}>
        <label>
          Old Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setOldPassword(e.target.value)}
           
          />
            {error.password && <p className="error">{error.password}</p>}
        </label>

        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          
          />
            {error.newPassword && <p className="error">{error.newPassword}</p>}
        </label>

        <label>
          Confirm New Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
           
          />
            {error.confirmPassword && (
    <p className="error">{error.confirmPassword}</p>
  )}
        </label>

        <button type="submit" className="update-button">
          Update
        </button>
      </form>
    </div>
  );
};

export default A_Changepassword;