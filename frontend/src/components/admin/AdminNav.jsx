import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Folder, Users, GitBranch, LogOut, User } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import './AdminNav.css';

function AdminNav() {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    const isSuperAdmin = auth?.role === 'SuperAdmin' || auth?.isSuperAdmin;
    const prefix = isSuperAdmin ? '/superadmin' : '/admin';

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("name");
        localStorage.removeItem("profileImage");
        setAuth({});
        navigate('/login');
    };

    return (
        <div className="admin-sidebar">
            {/* Top Profile section */}
            <div className="admin-sidebar-user">
                <div className="admin-avatar">
                    <User size={24} />
                </div>
                <div className="admin-user-details">
                    <h3 className="admin-name">{auth?.name || "Admin"}</h3>
                    <span className="admin-role-tag">{auth?.role || "Administrator"}</span>
                </div>
            </div>

            {/* Navigation menu */}
            <nav className="admin-sidebar-menu">
                <NavLink to={`${prefix}/dashboard`} className="admin-menu-item">
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to={`${prefix}/projects`} className="admin-menu-item">
                    <Folder size={18} />
                    <span>Projects</span>
                </NavLink>

                <NavLink to={`${prefix}/users`} className="admin-menu-item">
                    <Users size={18} />
                    <span>Users</span>
                </NavLink>

                <NavLink to={`${prefix}/versions`} className="admin-menu-item">
                    <GitBranch size={18} />
                    <span>Versions</span>
                </NavLink>
            </nav>

            {/* Logout button at the bottom */}
            <div className="admin-sidebar-bottom">
                <button onClick={handleLogout} className="admin-logout-btn">
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default AdminNav;
