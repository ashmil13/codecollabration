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
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <header className="mb-4">
            <div className="d-flex align-items-center gap-2">
              <GitBranch className="text-primary" size={28} />
              <div>
                <h1 className="h3 fw-bold mb-0">Manage Project Versions</h1>
                <p className="text-muted mb-0 small">Track history files, code commits, and delete redundant versions</p>
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

          {!loading && versions.length > 0 && (
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 p-3 bg-white border rounded shadow-sm">
              <div className="d-flex align-items-center gap-2">
                <span className="text-secondary"><Folder size={18} /></span>
                <label htmlFor="project-filter" className="fw-semibold text-secondary small mb-0">Project:</label>
                <select
                  id="project-filter"
                  value={selectedProjectName}
                  onChange={(e) => setSelectedProjectName(e.target.value)}
                  className="form-select form-select-sm"
                  style={{ width: 'auto', minWidth: '150px' }}
                >
                  {projectNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-muted small">
                Showing {filteredVersions.length} of {versions.length} versions
              </span>
            </div>
          )}

          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Retrieving code commits...</p>
            </div>
          ) : versions.length === 0 ? (
            <div className="card text-center p-5 border shadow-sm">
              <GitBranch size={48} className="text-muted mb-3 mx-auto" />
              <h3 className="h5 fw-bold text-dark">No Versions Found</h3>
              <p className="text-muted">There are currently no code versions tracked in the database.</p>
            </div>
          ) : filteredVersions.length === 0 ? (
            <div className="card text-center p-5 border shadow-sm">
              <GitBranch size={48} className="text-muted mb-3 mx-auto" />
              <h3 className="h5 fw-bold text-dark">No Versions for "{selectedProjectName}"</h3>
              <p className="text-muted">There are no code versions for the selected project.</p>
            </div>
          ) : (
            <div className="card shadow-sm border border-light overflow-hidden">
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4 py-3 text-secondary text-uppercase fs-7 fw-bold">Project Name</th>
                      <th className="py-3 text-secondary text-uppercase fs-7 fw-bold">Version</th>
                      <th className="py-3 text-secondary text-uppercase fs-7 fw-bold">Author</th>
                      <th className="py-3 text-secondary text-uppercase fs-7 fw-bold">Committed At</th>
                      <th className="px-4 py-3 text-center text-secondary text-uppercase fs-7 fw-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVersions.map((v) => (
                      <tr key={v._id}>
                        <td className="px-4 py-3 font-semibold text-dark">
                          <div className="d-flex align-items-center gap-2">
                            <Folder className="text-primary opacity-75" size={16} />
                            <span>{v.projectName || 'Legacy Project'}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle fs-7 px-2.5 py-1">V{v.versionNumber}</span>
                        </td>
                        <td className="py-3 text-muted">
                          <div className="d-flex align-items-center gap-1">
                            <User size={14} className="text-secondary" />
                            <span>{v.userName || 'Unknown User'}</span>
                          </div>
                        </td>
                        <td className="py-3 text-muted">
                          {new Date(v.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDelete(v._id, v.projectName, v.versionNumber)}
                            className="btn btn-sm btn-outline-danger"
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuperVersion;
