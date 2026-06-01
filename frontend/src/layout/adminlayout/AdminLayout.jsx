import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNav from '../../components/admin/AdminNav';

function AdminLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100%', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
      <AdminNav />
      
      <div style={{ flexGrow: 1, height: '100vh', overflowY: 'auto', padding: '1.5rem' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
