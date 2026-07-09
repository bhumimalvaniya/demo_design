import React, { useState ,useEffect} from "react";
import './Account.css'
import { FaUser, FaEnvelope, FaVenusMars, FaPhone, FaEdit } from "react-icons/fa";
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from "axios";
import API_URL from "../config/api";//for replace the url

const Account=()=>{
  const[user,setUser]=useState({});
  const[avatar,setAvatar]=useState(null);
  const [uploding,setUploading]=useState(false);

  const handleImageChange = async (e) => {

  const file = e.target.files[0];

  if (!file) return;

    const previewUrl = URL.createObjectURL(file);

  // IMAGE PREVIEW
  setUser({
    ...user,
    avatar: previewUrl,
  });

  setUploading(true);

  try {

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("avatar", file);

    // AUTO UPLOAD
    const res = await axios.put(
      // "http://localhost:5000/api/v1/cust/updateavatar",
       `${API_URL}/api/v1/cust/updateavatar`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

     setUser((prev) => ({
      ...prev,
      avatar: res.data.data.avatar,
    }));

    console.log(res.data);

   // setUser(res.data.data);

   // alert("Profile Updated Successfully");

    const updatedUser = {...user,avatar: res.data.data.avatar,};

    setUser(updatedUser);

  // SAVE UPDATED USER
  sessionStorage.setItem("user",JSON.stringify(updatedUser));

// TRIGGER HEADER UPDATE
window.dispatchEvent(new Event("userChanged"));

  } catch (error) {

    console.log("Upload error:", error);

  }
  finally{
    setUploading(false);
  }
};

const uploadAvatar = async () => {
  try {

    console.log("Upload button clicked");

    if (!avatar) {
      alert("Please select an image first");
      return;
    }

    const token = localStorage.getItem("token");
    console.log("Avatar file:", avatar);

    const formData = new FormData();
    formData.append("avatar", avatar);

    const res = await axios.put(
      //"http://localhost:5000/api/v1/cust/updateavatar",
      `${API_URL}/api/v1/cust/updateavatar`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
           "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(res.data);

    const updatedUser = res.data.data; // backend should return updated user

setUser(updatedUser);  
setAvatar(null);       

alert("Avatar updated!");

  } catch (error) {
    console.log("Upload error:", error);
  }
};
  useEffect(() => {

    
    const fetchUser = async () => {

      try {

        const token = localStorage.getItem("token");
        console.log("Token:",token);
        
        if (!token)
          {
            console.log("token not found");
              return;
          } 

        const res = await axios.get(
          // "http://localhost:5000/api/v1/cust/getcurrentuser",
           `${API_URL}/api/v1/cust/getcurrentuser`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("user api response:",res.data);
        setUser(res.data.data);

      } catch (err) {
       console.log("Fetch user error:", err.response?.data || err.message);
      }

    };

    fetchUser();

  }, []);

    return(
      
        <>
       
        <div className="account-page">
      <div className="account-container">
        <h5><i className="fa fa-fire"></i>  Account Detail</h5>
        <div className="account-header">
     <a className="account-title"  href="/"> <i className="fa fa-home"></i>  Home</a>  
          <a className="change-password" href="changepass">Change Password</a>
        </div>

        <div className="account-body">
          <h3>Change Account Details</h3>
        <div className="profile-picture">

  <img
    src={
      user?.avatar
        ? user.avatar.startsWith("blob:")
        ? user.avatar
        : user.avatar.startsWith("http")
          ? user.avatar
         // : `http://localhost:5000/uploads/${user.avatar}`
          : `${API_URL}/uploads/${user.avatar}`
        : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    }
    alt="profile"
    className="profile-imgs"
  />
  {uploding && (
  <p className="upload-text">
    Uploading...
  </p>
)}

  {/* HIDDEN INPUT */}
  <input
    type="file"
    id="fileInput"
    hidden
    accept="image/*"
    onChange={handleImageChange}
  />

  {/* CAMERA ICON */}
  <label htmlFor="fileInput" className="camera-btn">
    <i className="fa fa-camera"></i>
  </label>

</div>
          <div className="account-info">
            <div className="info-item">
              <i className="fa fa-user"></i>
              <span>{user.fnm}</span>
            <a href="Changedetail">  <i className="fa fa-edit" ></i></a>
            </div>

            <div className="info-item">
              <i className="fa fa-envelope"></i>
              <span>{user.email}</span>
              <a href="Changedetail"><i className="fa fa-edit"></i></a>
            </div>

            <div className="info-item">
              <i className="fa fa-venus-mars"></i>
              <span>{user.gender}</span>
             <a href="Changedetail"> <i className="fa fa-edit" ></i></a>
            </div>

            <div className="info-item">
              <i className="fa fa-phone"></i>
              <span>{user.phone_no}</span>
             <a href="Changedetail"><i className="fa fa-edit"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>

        </>
     
    );
}

export default Account;