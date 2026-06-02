import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from '../../pages/user/usersidebar';

function UserLayout() {
  return (
    <div className="d-flex flex-column flex-md-row min-vh-100 w-100 overflow-hidden">
      <UserSidebar />
  
      <div className="flex-grow-1 min-vh-100 overflow-y-auto bg-light">
        <Outlet />
      </div>
    </div>
  );
}

export default UserLayout;
