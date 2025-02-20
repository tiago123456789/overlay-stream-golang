import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Route } from "react-router";

const ProtectedRoute = () => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
