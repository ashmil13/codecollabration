import React, { useState, useEffect } from 'react';
import AdminService from '../../services/admin-services/Admin-Services';
import { Users, FolderGit2, AlertCircle, ShieldAlert } from 'lucide-react';
import '../../css/adminstyle/AdminDashboard.css';

function AdminDashboard() {
  const { getAdminStats } = AdminService();
  const [stats, setStats] = useState({ totalUsers: 0, totalProjects: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getAdminStats();
        if (response.data && response.data.success) {
          setStats(response.data.data);
        } else {
          setError('Failed to load dashboard metrics');
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError(err.response?.data?.error || 'An error occurred while loading dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <header className="mb-4">
            <div className="d-flex align-items-center gap-2">
              <ShieldAlert size={28} className="text-primary" />
              <div>
                <h1 className="h3 fw-bold mb-0">Admin Dashboard</h1>
                <p className="text-muted mb-0 small">System Overview & Control Panel</p>
              </div>
            </div>
          </header>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 mb-4" role="alert">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Loading analytics...</p>
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <div className="card shadow-sm h-100 border-0 stat-card" style={{ cursor: 'pointer' }}>
                  <div className="card-body p-4 d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-column">
                      <span className="text-uppercase text-muted fw-bold small mb-1">Users</span>
                      <h2 className="display-6 fw-bold text-dark mb-1">{stats.totalUsers}</h2>
                      <span className="text-muted small">Standard Accounts</span>
                    </div>
                    <div className="bg-light rounded p-3 text-secondary">
                      <Users size={32} />
                    </div>
                  </div>
                  <div className="card-footer bg-light border-top-0 d-flex justify-content-end py-2 px-4">
                    <span className="text-primary fw-semibold small">View all users</span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="card shadow-sm h-100 border-0 stat-card" style={{ cursor: 'pointer' }}>
                  <div className="card-body p-4 d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-column">
                      <span className="text-uppercase text-muted fw-bold small mb-1">Total Projects</span>
                      <h2 className="display-6 fw-bold text-dark mb-1">{stats.totalProjects}</h2>
                      <span className="text-muted small">Uploaded Repositories</span>
                    </div>
                    <div className="bg-light rounded p-3 text-secondary">
                      <FolderGit2 size={32} />
                    </div>
                  </div>
                  <div className="card-footer bg-light border-top-0 d-flex justify-content-end py-2 px-4">
                    <span className="text-primary fw-semibold small">View all projects</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
