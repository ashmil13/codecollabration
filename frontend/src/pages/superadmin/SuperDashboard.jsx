import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuperService from '../../services/superadmin-services/Super-Services';
import { Users, FolderGit2, AlertCircle, ShieldAlert, Shield } from 'lucide-react';
import '../../css/adminstyle/AdminDashboard.css';

function SuperDashboard() {
  const navigate = useNavigate();
  const { getSuperAdminStats } = SuperService();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalAdmins: 0,
    totalSuperAdmins: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getSuperAdminStats();
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
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-content">
        <header className="dashboard-header">
          <div className="dashboard-header-title">
            <ShieldAlert size={28} className="dashboard-icon-main" /> 
            <div>
              <h1>SuperAdmin Dashboard</h1>
              <p>System Overview & Control Panel</p>
            </div>
          </div>
        </header>

        {error && (
          <div className="dashboard-alert error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="dashboard-loading">
            <div className="spinner"></div>
            <p>Loading analytics...</p>
          </div>
        ) : (
          <div className="stats-grid">
            <div className="stat-card users-card" onClick={() => navigate('/superadmin/users')}>
              <div className="stat-card-inner">
                <div className="stat-info">
                  <span className="stat-label">Total Users</span>
                  <h2 className="stat-val">{stats.totalUsers}</h2>
                  <span className="stat-trend">Registered Accounts</span>
                </div>
                <div className="stat-icon-wrapper">
                  <Users size={32} />
                </div>
              </div>
              <div className="stat-card-footer">
                <span>View all users</span>
              </div>
            </div>

            <div className="stat-card projects-card" onClick={() => navigate('/superadmin/projects')}>
              <div className="stat-card-inner">
                <div className="stat-info">
                  <span className="stat-label">Total Projects</span>
                  <h2 className="stat-val">{stats.totalProjects}</h2>
                  <span className="stat-trend">Uploaded Repositories</span>
                </div>
                <div className="stat-icon-wrapper">
                  <FolderGit2 size={32} />
                </div>
              </div>
              <div className="stat-card-footer">
                <span>View all projects</span>
              </div>
            </div>

            <div className="stat-card admins-card" onClick={() => navigate('/superadmin/users')}>
              <div className="stat-card-inner">
                <div className="stat-info">
                  <span className="stat-label">Admin Users</span>
                  <h2 className="stat-val">{stats.totalAdmins || 0}</h2>
                  <span className="stat-trend">System Admins</span>
                </div>
                <div className="stat-icon-wrapper">
                  <Shield size={32} />
                </div>
              </div>
              <div className="stat-card-footer">
                <span>View all admins</span>
              </div>
            </div>

            <div className="stat-card superadmins-card" onClick={() => navigate('/superadmin/users')}>
              <div className="stat-card-inner">
                <div className="stat-info">
                  <span className="stat-label">SuperAdmins</span>
                  <h2 className="stat-val">{stats.totalSuperAdmins || 0}</h2>
                  <span className="stat-trend">System Directors</span>
                </div>
                <div className="stat-icon-wrapper">
                  <ShieldAlert size={32} />
                </div>
              </div>
              <div className="stat-card-footer">
                <span>View all superadmins</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuperDashboard;
