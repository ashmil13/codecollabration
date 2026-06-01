import React, { useState, useEffect } from 'react';
import AdminService from '../../services/admin-services/Admin-Services';
import { Trash2, GitBranch, Calendar, User, AlertCircle, CheckCircle, Folder } from 'lucide-react';
import '../../css/adminstyle/AdminVersions.css';

function SuperVersion() {
  const { getAllVersions, deleteVersionByAdmin } = AdminService();
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedProjectName, setSelectedProjectName] = useState('All');

  const fetchVersions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllVersions();
      if (response.data && response.data.success) {
        setVersions(response.data.data);
      } else {
        setError('Failed to fetch versions list');
      }
    } catch (err) {
      console.error('Error fetching admin versions:', err);
      setError(err.response?.data?.error || 'An error occurred while loading versions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  const handleDelete = async (versionId, projectName, versionNumber) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete Version ${versionNumber} of "${projectName}"? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      setError('');
      setSuccessMsg('');
      const response = await deleteVersionByAdmin(versionId);
      if (response.data && response.data.success) {
        setSuccessMsg(`Version ${versionNumber} of "${projectName}" was deleted successfully.`);
        fetchVersions();
      } else {
        setError('Failed to delete version');
      }
    } catch (err) {
      console.error('Error deleting version:', err);
      setError(err.response?.data?.error || 'An error occurred while trying to delete the version');
    }
  };

  const projectNames = ['All', ...new Set(versions.map(v => v.projectName).filter(Boolean))];


  const filteredVersions = selectedProjectName === 'All'
    ? versions
    : versions.filter(v => v.projectName === selectedProjectName);

  return (
    <div className="admin-versions-container">
      <div className="admin-versions-header">
        <div className="header-title-wrapper">
          <GitBranch className="header-icon" size={28} />
          <div>
            <h1>Manage Project Versions</h1>
            <p>Track history files, code commits, and delete redundant versions</p>
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

      {!loading && versions.length > 0 && (
        <div className="filter-section-wrapper">
          <div className="filter-box">
            <span className="filter-icon-lbl"><Folder size={16} /></span>
            <label htmlFor="project-filter" className="filter-lbl">Project:</label>
            <select
              id="project-filter"
              value={selectedProjectName}
              onChange={(e) => setSelectedProjectName(e.target.value)}
              className="project-filter-select"
            >
              {projectNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <span className="filtered-count">
            Showing {filteredVersions.length} of {versions.length} versions
          </span>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Retrieving code commits...</p>
        </div>
      ) : versions.length === 0 ? (
        <div className="empty-state">
          <GitBranch size={48} className="empty-icon" />
          <h3>No Versions Found</h3>
          <p>There are currently no code versions tracked in the database.</p>
        </div>
      ) : filteredVersions.length === 0 ? (
        <div className="empty-state">
          <GitBranch size={48} className="empty-icon" />
          <h3>No Versions for "{selectedProjectName}"</h3>
          <p>There are no code versions for the selected project.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="versions-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Version</th>
                <th>Author</th>
                <th>Committed At</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVersions.map((v) => (
                <tr key={v._id} className="version-row">
                  <td className="project-name-cell">
                    <Folder className="row-folder-icon" size={16} />
                    <span className="project-name-text">{v.projectName || 'Legacy Project'}</span>
                  </td>
                  <td className="version-number-cell">
                    <span className="version-tag">V{v.versionNumber}</span>
                  </td>
                  <td className="author-cell">
                    <User className="row-user-icon" size={14} />
                    <span>{v.userName || 'Unknown User'}</span>
                  </td>
                  <td className="date-cell">
                    <Calendar className="row-calendar-icon" size={14} />
                    <span>{new Date(v.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </td>
                  <td className="actions-cell text-center">
                    <button
                      onClick={() => handleDelete(v._id, v.projectName, v.versionNumber)}
                      className="delete-action-btn"
                      title={`Delete Version ${v.versionNumber}`}
                    >
                      <Trash2 size={16} />
                    </button>
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

export default SuperVersion;
