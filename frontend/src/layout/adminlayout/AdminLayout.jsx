import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNav from '../../components/admin/AdminNav';

function AdminLayout() {
  return (
    <div className="d-flex flex-column flex-md-row min-vh-100 w-100 overflow-hidden" style={{ backgroundColor: '#f1f5f9' }}>
      <AdminNav />
      
      <div className="flex-grow-1 min-vh-100 overflow-y-auto p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
