import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function AdminProtectedRouter() {
  const { auth } = useAuth();

  const isAuthorized = auth?.accessToken && (
    auth?.role?.toLowerCase() === 'admin' ||
    auth?.role?.toLowerCase() === 'superadmin' ||
    auth?.isAdmin ||
    auth?.isSuperAdmin
  );

  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
}

export default AdminProtectedRouter;
