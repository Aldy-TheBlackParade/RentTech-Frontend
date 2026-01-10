import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("accessToken");
  const storedUser = localStorage.getItem("user");
  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }
  const user = JSON.parse(storedUser);
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
