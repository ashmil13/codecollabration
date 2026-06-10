import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import './AdminNav.css';

function AdminNav() {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    const isSuperAdmin = auth?.role === 'SuperAdmin' || auth?.isSuperAdmin;
    const prefix = isSuperAdmin ? '/superadmin' : '/admin';
    const [isOpen, setIsOpen] = React.useState(false);

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
        <div className={`admin-sidebar ${isOpen ? 'show-mobile' : ''}`}>
            {/* Mobile Header with Toggle Button */}
            <div className="sidebar-mobile-header d-md-none d-flex justify-content-between align-items-center w-100 px-3 py-2 border-bottom">
                <span className="fw-bold text-dark fs-5">{isSuperAdmin ? 'SuperAdmin' : 'AdminPanel'}</span>
                <button 
                    type="button" 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? 'Close Menu' : 'Open Menu'}
                </button>
            </div>

            {/* Sidebar content wrapper - visible on desktop, toggleable on mobile */}
            <div className={`sidebar-content-wrapper d-none d-md-flex flex-column h-100 w-100 ${isOpen ? 'd-flex-important' : ''}`}>
                {/* Top Profile section */}
                <div className="admin-sidebar-user">
                    <div className="admin-avatar">
                        <i className="fa-solid fa-user" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div className="admin-user-details">
                        <h3 className="admin-name">{auth?.name || "Admin"}</h3>
                        <span className="admin-role-tag">{auth?.role || "Administrator"}</span>
                    </div>
                </div>

                {/* Navigation menu */}
                <nav className="admin-sidebar-menu">
                    <NavLink to={`${prefix}/dashboard`} className="admin-menu-item" onClick={() => setIsOpen(false)}>
                        <i className="fa-solid fa-gauge-high" style={{ fontSize: '18px' }}></i>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to={`${prefix}/projects`} className="admin-menu-item" onClick={() => setIsOpen(false)}>
                        <i className="fa-solid fa-folder" style={{ fontSize: '18px' }}></i>
                        <span>Projects</span>
                    </NavLink>

                    <NavLink to={`${prefix}/users`} className="admin-menu-item" onClick={() => setIsOpen(false)}>
                        <i className="fa-solid fa-users" style={{ fontSize: '18px' }}></i>
                        <span>Users</span>
                    </NavLink>

                    <NavLink to={`${prefix}/versions`} className="admin-menu-item" onClick={() => setIsOpen(false)}>
                        <i className="fa-solid fa-code-branch" style={{ fontSize: '18px' }}></i>
                        <span>Versions</span>
                    </NavLink>
                </nav>

                {/* Logout button at the bottom */}
                <div className="admin-sidebar-bottom mt-auto">
                    <button onClick={handleLogout} className="admin-logout-btn">
                        <i className="fa-solid fa-right-from-bracket" style={{ fontSize: '18px' }}></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminNav;
