import React, { useState, useEffect } from 'react';
import AdminService from '../../services/admin-services/Admin-Services';
import SuperService from '../../services/superadmin-services/Super-Services';
import UserService from '../../services/user-services/User-Service';
import { Trash2, User, Mail, Shield, AlertCircle, CheckCircle, PlusCircle, ShieldAlert, Edit2, X } from 'lucide-react';
import '../../css/superadminstyle/SuperUser.css';
import useAuth from '../../hooks/useAuth';

function AdminSuper() {
    const { getAllUsers, deleteUserByAdmin } = AdminService();
    const { updateUserRole } = SuperService();
    const { postRegister } = UserService();
    const { auth } = useAuth();

    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUserId, setEditingUserId] = useState(null);
    const [tempRole, setTempRole] = useState('');
    
   
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getAllUsers();
            if (response.data && response.data.success) {
        
                const onlyAdmins = response.data.data.filter(u => u.role?.toLowerCase() === 'admin');
                setAdmins(onlyAdmins);
            } else {
                setError('Failed to fetch administrators list');
            }
        } catch (err) {
            console.error('Error fetching admins:', err);
            setError(err.response?.data?.error || 'An error occurred while loading admins');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!name.trim() || !email.trim() || !password) {
            setError('Please fill in all fields.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        try {
            setSubmitting(true);
            const response = await postRegister({ name, email, password, role: 'admin' });
            if (response.data && response.data.success) {
               
                setSuccessMsg(`Administrator "${name}" registered successfully.`);
                
                const newAdmin = {
                    _id: response.data.userId || Date.now().toString(),
                    name: response.data.name || name,
                    email: email,
                    role: response.data.role || 'admin',
                    isAdmin: response.data.isAdmin ?? true,
                    isSuperAdmin: response.data.isSuperAdmin ?? false,
                    profileImage: response.data.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`
                };

                setAdmins((prev) => [...prev, newAdmin]);

                setName('');
                setEmail('');
                setPassword('');
            } else {
                setError(response.data?.error || 'Failed to register administrator');
            }
        } catch (err) {
            console.error('Error creating admin:', err);
            setError(err.response?.data?.error || 'An error occurred while creating the admin account');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (adminId, adminName) => {
        if (adminId === auth?.id) {
            setError('You cannot delete your own logged-in account.');
            return;
        }

        const confirmDelete = window.confirm(`Are you sure you want to delete administrator "${adminName}"? This will permanently revoke their access and delete associated data.`);
        if (!confirmDelete) return;

        try {
            setError('');
            setSuccessMsg('');
            const response = await deleteUserByAdmin(adminId);
            if (response.data && response.data.success) {
                setSuccessMsg(`Administrator "${adminName}" was deleted successfully.`);
                fetchAdmins();
            } else {
                setError('Failed to delete administrator');
            }
        } catch (err) {
            console.error('Error deleting admin:', err);
            setError(err.response?.data?.error || 'An error occurred while trying to delete the administrator');
        }
    };

    const handleSaveRole = async (userId, newRole) => {
        try {
            setError('');
            setSuccessMsg('');

            const targetAdmin = admins.find((u) => u._id === userId);
            const adminName = targetAdmin ? targetAdmin.name : 'this administrator';

            const confirmChange = window.confirm(`Are you sure you want to change the role of "${adminName}" to "${newRole}"?`);
            if (!confirmChange) return;

            const response = await updateUserRole(userId, newRole);
            if (response.data && response.data.success) {
                setSuccessMsg(`Administrator role updated to "${newRole}" successfully.`);
                fetchAdmins();
                setEditingUserId(null);
            } else {
                setError('Failed to update administrator role');
            }
        } catch (err) {
            console.error('Error updating administrator role:', err);
            setError(err.response?.data?.error || 'An error occurred while updating the role');
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <header className="mb-4">
                        <div className="d-flex align-items-center gap-2">
                            <ShieldAlert className="text-primary" size={28} />
                            <div>
                                <h1 className="h3 fw-bold mb-0">Manage Administrators</h1>
                                <p className="text-muted mb-0 small">Create new administrators and manage system administrative credentials</p>
                            </div>
                        </div>
                    </header>

                    {error && (
                        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 mb-4" role="alert">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {successMsg && (
                        <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 mb-4" role="alert">
                            <CheckCircle size={20} />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    <div className="row g-4">

                        <div className="col-12 col-lg-4">
                            <div className="card shadow-sm border border-light p-4 h-100">
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <PlusCircle size={20} className="text-primary" />
                                    <h2 className="h5 fw-bold mb-0 text-dark">Register Admin</h2>
                                </div>
                                <p className="text-muted small mb-4">Add a new admin account to the system. They will have full read/write access to dashboard projects, users, and versions.</p>
                                
                                <form onSubmit={handleCreateAdmin}>
                                    <div className="mb-3">
                                        <label htmlFor="admin-name" className="form-label fw-semibold text-secondary small">Full Name</label>
                                        <input
                                            id="admin-name"
                                            type="text"
                                            className="form-control"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            disabled={submitting}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="admin-email" className="form-label fw-semibold text-secondary small">Email Address</label>
                                        <input
                                            id="admin-email"
                                            type="email"
                                            className="form-control"
                                         
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={submitting}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="admin-password" className="form-label fw-semibold text-secondary small">Password</label>
                                        <input
                                            id="admin-password"
                                            type="password"
                                            className="form-control"
                                        
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={submitting}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                <span>Creating Account...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Shield size={18} />
                                                <span>Create Admin Account</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                    
                        <div className="col-12 col-lg-8">
                            <div className="card shadow-sm border border-light overflow-hidden h-100">
                                <div className="card-header bg-white border-bottom-0 pt-4 px-4 pb-2">
                                    <div className="d-flex align-items-center gap-2">
                                        <Shield size={20} className="text-primary" />
                                        <h2 className="h5 fw-bold mb-0 text-dark">Active Administrators</h2>
                                    </div>
                                </div>
                                
                                {loading ? (
                                    <div className="d-flex flex-column align-items-center justify-content-center py-5 h-100">
                                        <div className="spinner-border text-primary mb-3" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="text-muted small">Retrieving administrator credentials...</p>
                                    </div>
                                ) : admins.length === 0 ? (
                                    <div className="d-flex flex-column align-items-center justify-content-center py-5 h-100">
                                        <Shield size={48} className="text-muted mb-3" />
                                        <h3 className="h6 fw-bold text-dark">No Administrators Found</h3>
                                        <p className="text-muted small">No administrative accounts exist in the database.</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive h-100">
                                        <table className="table table-striped table-hover align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="px-4 py-3 text-secondary text-uppercase fs-7 fw-bold" style={{ width: '80px' }}>Profile</th>
                                                    <th className="py-3 text-secondary text-uppercase fs-7 fw-bold">Name</th>
                                                    <th className="py-3 text-secondary text-uppercase fs-7 fw-bold">Email Address</th>
                                                    <th className="py-3 text-secondary text-uppercase fs-7 fw-bold">System Role</th>
                                                    <th className="px-4 py-3 text-center text-secondary text-uppercase fs-7 fw-bold" style={{ width: '100px' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {admins.map((admin) => (
                                                    <tr key={admin._id} className={admin._id === auth?.id ? 'table-primary-subtle' : ''}>
                                                        <td className="px-4 py-3">
                                                            <div className="user-avatar-initials">
                                                                {admin.name ? admin.name.charAt(0).toUpperCase() : '?'}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 fw-semibold text-dark">
                                                            <span>{admin.name}</span>
                                                            {admin._id === auth?.id && <span className="badge bg-primary ms-2 small">You</span>}
                                                        </td>
                                                        <td className="py-3 text-muted">
                                                            <div className="d-flex align-items-center gap-1">
                                                                <Mail size={16} className="text-secondary" />
                                                                <span>{admin.email}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3">
                                                            {editingUserId === admin._id ? (
                                                                <div className="d-inline-block">
                                                                    <select
                                                                        value={tempRole}
                                                                        onChange={(e) => setTempRole(e.target.value)}
                                                                        className="form-select form-select-sm fw-semibold"
                                                                        style={{ width: '130px' }}
                                                                    >
                                                                        <option value="User">User</option>
                                                                        <option value="Admin">Admin</option>
                                                                    </select>
                                                                </div>
                                                            ) : (
                                                                <span className="badge bg-info-subtle text-info border border-info-subtle py-1.5 px-2.5 rounded d-inline-flex align-items-center gap-1 small">
                                                                    <Shield size={12} />
                                                                    <span>{admin.role}</span>
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            {editingUserId === admin._id ? (
                                                                <div className="d-flex justify-content-center gap-2">
                                                                    <button
                                                                        onClick={() => handleSaveRole(admin._id, tempRole)}
                                                                        className="btn btn-sm btn-success py-1"
                                                                        title="Save Role"
                                                                    >
                                                                        <CheckCircle size={14} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setEditingUserId(null)}
                                                                        className="btn btn-sm btn-secondary py-1"
                                                                        title="Cancel"
                                                                    >
                                                                        <X size={14} />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="d-flex justify-content-center gap-2">
                                                                    <button
                                                                        onClick={() => { setEditingUserId(admin._id); setTempRole(admin.role); }}
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        title="Change Role"
                                                                        disabled={admin._id === auth?.id}
                                                                    >
                                                                        <Edit2 size={14} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(admin._id, admin.name)}
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        title={admin._id === auth?.id ? "Cannot delete yourself" : `Delete "${admin.name}"`}
                                                                        disabled={admin._id === auth?.id}
                                                                    >
                                                                        <Trash2 size={14} />
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminSuper;
