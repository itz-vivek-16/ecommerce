import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../layout/Loader/Loader";

const ProtectedRoute = ({ isAdmin }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  // 1. Wait until user auth data is fetched from backend
  if (loading) return <Loader />;

  // 2. If user is not logged in, redirect them to the /login page
  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  // 3. If route requires Admin status, check if user is an admin
  if (isAdmin === true && user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // 4. If all checks pass, render the protected component nested inside
  return <Outlet />;
};

export default ProtectedRoute;