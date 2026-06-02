import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Folder, Users, GitBranch, LogOut, User } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import '../../css/superadminstyle/SuperNav.css';



function SuperNav() {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
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
                <span className="fw-bold text-dark fs-5">SuperAdmin</span>
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
                        <User size={24} />
                    </div>
                    <div className="admin-user-details">
                        <h3 className="admin-name">{auth?.name || "SuperAdmin"}</h3>
                        <span className="admin-role-tag">{auth?.role || "Administrator"}</span>
                    </div>
                </div>

                {/* Navigation menu */}
                <nav className="admin-sidebar-menu">
                    <NavLink to="/superadmin/dashboard" className="admin-menu-item" onClick={() => setIsOpen(false)}>
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/superadmin/projects" className="admin-menu-item" onClick={() => setIsOpen(false)}>
                        <Folder size={18} />
                        <span>Projects</span>
                    </NavLink>

                    <NavLink to="/superadmin/users" className="admin-menu-item" onClick={() => setIsOpen(false)}>
                        <Users size={18} />
                        <span>Users</span>
                    </NavLink>

                    <NavLink to="/superadmin/versions" className="admin-menu-item" onClick={() => setIsOpen(false)}>
                        <GitBranch size={18} />
                        <span>Versions</span>
                    </NavLink>
                </nav>

                {/* Logout button at the bottom */}
                <div className="admin-sidebar-bottom mt-auto">
                    <button onClick={handleLogout} className="admin-logout-btn">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SuperNav;