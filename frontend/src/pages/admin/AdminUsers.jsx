import React, { useState, useEffect } from 'react';
import AdminService from '../../services/admin-services/Admin-Services';
import { Trash2, User, Mail, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import '../../css/adminstyle/AdminUsers.css';
import useAuth from '../../hooks/useAuth';

function AdminUserList() {
  const { getAllUsers, deleteUserByAdmin } = AdminService();
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
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
      console.error('Error fetching admin users:', err);
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
      setError('You cannot delete your own admin account.');
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

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <header className="mb-4">
            <div className="d-flex align-items-center gap-2">
              <User className="text-primary" size={28} />
              <div>
                <h1 className="h3 fw-bold mb-0">Manage Users</h1>
                <p className="text-muted mb-0 small">Control user accounts, track their system roles, and revoke access</p>
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

          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Retrieving user profiles...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="card text-center p-5 border shadow-sm">
              <User size={48} className="text-muted mb-3 mx-auto" />
              <h3 className="h5 fw-bold text-dark">No Users Found</h3>
              <p className="text-muted">There are no registered users in the database.</p>
            </div>
          ) : (
            <div className="card shadow-sm border border-light overflow-hidden">
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4 py-3 text-secondary text-uppercase fs-7 fw-bold">Profile</th>
                      <th className="py-3 text-secondary text-uppercase fs-7 fw-bold">Name</th>
                      <th className="py-3 text-secondary text-uppercase fs-7 fw-bold">Email Address</th>
                      <th className="py-3 text-secondary text-uppercase fs-7 fw-bold">System Role</th>
                      <th className="px-4 py-3 text-center text-secondary text-uppercase fs-7 fw-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className={user._id === auth?.id ? 'table-primary-subtle' : ''}>
                        <td className="px-4 py-3">
                          <div className="user-avatar-initials">
                            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                          </div>
                        </td>
                        <td className="py-3 fw-semibold text-dark">
                          <span>{user.name}</span>
                          {user._id === auth?.id && <span className="badge bg-primary ms-2 small">You</span>}
                        </td>
                        <td className="py-3 text-muted">
                          <div className="d-flex align-items-center gap-1">
                            <Mail size={16} className="text-secondary" />
                            <span>{user.email}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`badge ${user.role.toLowerCase() === 'superadmin' ? 'bg-purple-subtle text-purple border border-purple-subtle' : user.role.toLowerCase() === 'admin' ? 'bg-info-subtle text-info border border-info-subtle' : 'bg-secondary-subtle text-secondary'} py-1.5 px-2.5 rounded d-inline-flex align-items-center gap-1 small`}>
                            <Shield size={12} />
                            <span>{user.role}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDelete(user._id, user.name)}
                            className="btn btn-sm btn-outline-danger"
                            title={user._id === auth?.id ? "Cannot delete yourself" : `Delete "${user.name}"`}
                            disabled={user._id === auth?.id}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUserList;
