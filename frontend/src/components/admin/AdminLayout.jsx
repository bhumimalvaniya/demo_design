import React from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import {
  FaUsers,
  FaUserFriends,
  FaCalendarAlt,
  FaSitemap,
  FaImage,
  FaEnvelope,
  FaSignOutAlt,
  FaCircle,
} from "react-icons/fa";

const AdminLayout = () => {
  const navigate = useNavigate();

  const adminName = sessionStorage.getItem("adminName");

  const logout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminName");
    navigate("/admin/adminlogin");
  };

  return (
    <>
      <div className="admin-header">
        <h2>Admin</h2>

        <div className="profile">
          <div className="circle"></div>

          <span>
            Event Management
            <br />
            <Link to="/admin/profile">
              {adminName || "Admin"}
            </Link>
          </span>
        </div>
      </div>

      <div className="sidebar">
        <h2>Dashboard</h2>

        <ul>
          <li onClick={() => navigate("/admin")}>
            Dashboard
          </li>

          <li onClick={() => navigate("/admin/userlist")}>
            <FaUsers className="icon" /> User List
          </li>

          <li onClick={() => navigate("/admin/addmenu")}>
            <FaUserFriends className="icon" /> Add Menu
          </li>

          <li onClick={() => navigate("/admin/addevent")}>
            <FaCalendarAlt className="icon" /> Event Post
          </li>

          <li onClick={() => navigate("/admin/addcategory")}>
            <FaSitemap className="icon" /> Post Category
          </li>

          <li onClick={() => navigate("/admin/addgallary")}>
            <FaImage className="icon" /> Add Gallery
          </li>

          <li onClick={() => navigate("/admin/addaboutus")}>
            <FaCircle className="icon" /> Add AboutUs
          </li>

          <li onClick={() => navigate("/admin/contactlist")}>
            <FaEnvelope className="icon" /> Contact List
          </li>

          <li onClick={() => navigate("/admin/bookinglist")}>
            <FaCalendarAlt className="icon" /> Booking List
          </li>

          <li onClick={logout}>
            <FaSignOutAlt className="icon" /> Logout
          </li>
        </ul>
      </div>

      <Outlet />
    </>
  );
};

export default AdminLayout;