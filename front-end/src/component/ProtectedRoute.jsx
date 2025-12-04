import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roles }) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");

  if (!token || !user) {

    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {

    if (user.role === 'admin') return <Navigate to="/Admin" replace />;
    if (user.role === 'seller') return <Navigate to="/Seller" replace />;
    return <Navigate to="/" replace />; 
  }

  return children;
};

export default ProtectedRoute;
