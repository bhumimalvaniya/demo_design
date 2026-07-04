import React from "react";
import { Children } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const token = sessionStorage.getItem("adminToken");

  // If token not found -> go to login page
  if (!token) {
    return <Navigate to="/admin/adminlogin" replace/>;
  }

  // If token found → open dashboard
 // return <Outlet />;
 return Children;
};

export default ProtectedAdminRoute;