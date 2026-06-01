import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function SuperProtectedRouter() {
  const { auth } = useAuth();

  const isAuthorized = auth?.accessToken && (auth?.role === 'SuperAdmin' || auth?.isSuperAdmin);

  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
}

export default SuperProtectedRouter;
