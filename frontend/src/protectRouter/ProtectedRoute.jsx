import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function ProtectedRoute() {
  const { auth } = useAuth();

  return auth?.accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
