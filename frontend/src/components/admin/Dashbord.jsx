import React, { useEffect, useState } from "react";
import "./Dashbord.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import gallary from "../../../../backend/Model/GallarySchema";

export const Dashbord = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    bookings: 0,
    categorys:0,
    gallarys:0,
    upcoming: 0,
    expired:0
  });

  const token = sessionStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin/adminlogin");
    } else {
      fetchStats();
    }
  }, [token]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dashboard-content">
      <div className="cards1">

        <div className="card">
          <h3>Total Users</h3>
          <p>{stats.users}</p>
        </div>

        <div className="card">
          <h3>Total Events</h3>
          <p>{stats.events}</p>
        </div>

        <div className="card">
          <h3>Total Category</h3>
          <p>{stats.categorys}</p>
        </div>

         <div className="card">
          <h3>Total Bookings</h3>
          <p>{stats.bookings}</p>
        </div>

         <div className="card">
          <h3>Total Gallery Post</h3>
          <p>{stats.gallarys}</p>
        </div>

        <div className="card">
          <h3>Upcoming Events</h3>
          <p>{stats.upcoming}</p>
        </div>

        <div className="card">
          <h3>Expired Events</h3>
          <p>{stats.expired}</p>
        </div>

      </div>
    </div>
  );
};