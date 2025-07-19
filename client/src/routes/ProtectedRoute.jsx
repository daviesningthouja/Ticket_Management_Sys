import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getToken, getUser } from "../utils/authUtils";
//import { jwtDecode } from "jwt-decode";
const ProtectedRoute = ({ role }) => {
  try {
    const token = getToken();
    const user = getUser();

    //console.log(token);
    if(!token)
      return <Navigate to="/" />;
    if (role && user.role !== role) return <Navigate to="/" />;
    
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    localStorage.removeItem("token"); // Invalid token
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
