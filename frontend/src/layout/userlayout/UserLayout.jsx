import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from '../../pages/user/usersidebar';

function UserLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
      <UserSidebar />
  
      <div style={{ flexGrow: 1, height: '100vh', overflowY: 'auto', background: '#f1f5f9' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default UserLayout;
