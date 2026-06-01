import React, { useState, useEffect } from 'react';
import AdminService from '../../services/admin-services/Admin-Services';
import SuperService from '../../services/superadmin-services/Super-Services';

import { Trash2, User, Mail, Shield, AlertCircle, CheckCircle, Edit2, X } from 'lucide-react';
import '../../css/superadminstyle/SuperUser.css';
import useAuth from '../../hooks/useAuth';

function SuperUserList() {
    const { getAllUsers, deleteUserByAdmin } = AdminService();
    const { updateUserRole } = SuperService();
    const { auth } = useAuth();
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [tempRole, setTempRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getAllUsers();
            if (response.data && response.data.success) {
                setUsers(response.data.data);
            } else {
                setError('Failed to fetch users list');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.response?.data?.error || 'An error occurred while loading users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId, userName) => {
      
        if (userId === auth?.id) {
            setError('You cannot delete your own superadmin account.');
            return;
        }

        const confirmDelete = window.confirm(`Are you sure you want to delete user "${userName}"? This will permanently delete their account and all their uploaded code projects and versions.`);
        if (!confirmDelete) return;

        try {
            setError('');
            setSuccessMsg('');
            const response = await deleteUserByAdmin(userId);
            if (response.data && response.data.success) {
                setSuccessMsg(`User "${userName}" was deleted successfully.`);
                fetchUsers();
            } else {
                setError('Failed to delete user');
            }
        } catch (err) {
            console.error('Error deleting user:', err);
            setError(err.response?.data?.error || 'An error occurred while trying to delete the user');
        }
    };

    const handleSaveRole = async (userId, newRole) => {
        try {
            setError('');
            setSuccessMsg('');

            const targetUser = users.find((u) => u._id === userId);
            const userName = targetUser ? targetUser.name : 'this user';

            const confirmChange = window.confirm(`Are you sure you want to change the role of "${userName}" to "${newRole}"?`);
            if (!confirmChange) return;

            const response = await updateUserRole(userId, newRole);
            if (response.data && response.data.success) {
                setSuccessMsg(`User role updated to "${newRole}" successfully.`);
                setUsers((prevUsers) =>
                    prevUsers.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
                );

    
            
                setEditingUserId(null);
            } else {
                setError('Failed to update user role');
            }
        } catch (err) {
            console.error('Error updating user role:', err);
            setError(err.response?.data?.error || 'An error occurred while updating the role');
        }
    };

    return (
        <div className="admin-users-container">
            <div className="admin-users-header">
                <div className="header-title-wrapper">
                    <User className="header-icon" size={28} />
                    <div>
                        <h1>Manage Users</h1>
                        <p>Control user accounts, track their system roles, and revoke access</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="alert alert-error">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {successMsg && (
                <div className="alert alert-success">
                    <CheckCircle size={20} />
                    <span>{successMsg}</span>
                </div>
            )}

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Retrieving user profiles...</p>
                </div>
            ) : users.length === 0 ? (
                <div className="empty-state">
                    <User size={48} className="empty-icon" />
                    <h3>No Users Found</h3>
                    <p>There are no registered users in the database.</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Profile</th>
                                <th>Name</th>
                                <th>Email Address</th>
                                <th>System Role</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className={`user-row ${user._id === auth?.id ? 'current-user-row' : ''}`}>
                                    <td className="profile-image-cell">
                                        <div className="user-avatar-initials">
                                            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    </td>
                                    <td className="user-name-cell">
                                        <span className="user-name-text">{user.name}</span>
                                        {user._id === auth?.id && <span className="current-user-badge">You</span>}
                                    </td>
                                    <td className="email-cell">
                                        <Mail className="row-mail-icon" size={16} />
                                        <span>{user.email}</span>
                                    </td>
                                    <td className="role-cell">
                                        {editingUserId === user._id ? (
                                            <div className="role-selector-wrapper">
                                                <select
                                                    value={tempRole}
                                                    onChange={(e) => setTempRole(e.target.value)}
                                                    className={`role-select ${tempRole.toLowerCase()}`}
                                                >
                                                    <option value="User">User</option>
                                                    <option value="Admin">Admin</option>
                                                    <option value="SuperAdmin">SuperAdmin</option>
                                                </select>
                                            </div>
                                        ) : (
                                            <div className={`role-badge ${user.role.toLowerCase()}`}>
                                                <Shield size={14} className="role-icon" />
                                                <span>{user.role}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="actions-cell text-center">
                                        {editingUserId === user._id ? (
                                            <div className="actions-edit-wrapper">
                                                <button
                                                    onClick={() => handleSaveRole(user._id, tempRole)}
                                                    className="save-action-btn"
                                                    title="Save Role"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingUserId(null)}
                                                    className="cancel-action-btn"
                                                    title="Cancel"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="actions-normal-wrapper">
                                                <button
                                                    onClick={() => { setEditingUserId(user._id); setTempRole(user.role); }}
                                                    className="edit-action-btn"
                                                    title="Change Role"
                                                    disabled={user._id === auth?.id}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id, user.name)}
                                                    className="delete-action-btn"
                                                    title={user._id === auth?.id ? "Cannot delete yourself" : `Delete "${user.name}"`}
                                                    disabled={user._id === auth?.id}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default SuperUserList;
