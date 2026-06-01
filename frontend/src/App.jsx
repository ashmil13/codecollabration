import { useState } from 'react';
import useAuth from './hooks/useAuth';
import Login from './pages/user/login';
import Signup from './pages/user/signup';
import Project from './pages/user/Project';
import Version from './pages/user/version';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DefualtProtectedRouter from './protectRouter/DefualtProtectedRouter';
import ProtectedRoute from './protectRouter/ProtectedRoute';
import UserLayout from './layout/userlayout/UserLayout';
import { AuthProvider } from './Context/Authcontext';
import AdminProtectedRouter from './protectRouter/AdminProtectRouter';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjectList from './pages/admin/AdminProject';
import AdminUserList from './pages/admin/AdminUsers';
import AdminLayout from './layout/adminlayout/AdminLayout';
import AdminVersionList from './pages/admin/AdminVersions';
import SuperProtectedRouter from './protectRouter/SuperProtectRouter';
import SuperDashboard from './pages/superadmin/SuperDashboard';
import SuperProjectList from './pages/superadmin/SuperProject';
import SuperUserList from './pages/superadmin/SuperUser';
import SuperLayout from './layout/superadminlayout/SuperLayout';
import SuperVersionList from './pages/superadmin/SuperVersion';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route element={<DefualtProtectedRouter />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          
          <Route element={<ProtectedRoute />}>
            <Route element={<UserLayout />}>
              <Route path="/user/upload" element={<Project />} />
              <Route path="/user/version" element={<Version />} />
            </Route>
          </Route>
          <Route element={<AdminProtectedRouter />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/projects" element={<AdminProjectList />} />
              <Route path="/admin/users" element={<AdminUserList />} />
              <Route path="/admin/versions" element={<AdminVersionList />} />
            </Route>
          </Route>

          <Route element={<SuperProtectedRouter />}>
            <Route element={<SuperLayout />}>
              <Route path="/superadmin/dashboard" element={<SuperDashboard />} />
              <Route path="/superadmin/projects" element={<SuperProjectList />} />
              <Route path="/superadmin/users" element={<SuperUserList />} />
              <Route path="/superadmin/versions" element={<SuperVersionList />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
