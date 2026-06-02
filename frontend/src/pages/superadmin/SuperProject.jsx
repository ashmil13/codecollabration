import React, { useState, useEffect } from 'react';
import AdminService from '../../services/admin-services/Admin-Services';
import { Trash2, Folder, Calendar, User, AlertCircle, CheckCircle } from 'lucide-react';
import '../../css/adminstyle/AdminProject.css';

function SuperProject() {
  const { getAllProjects, deleteProjectByAdmin } = AdminService();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllProjects();
      if (response.data && response.data.success) {
        setProjects(response.data.data);
      } else {
        setError('Failed to fetch projects list');
      }
    } catch (err) {
      console.error('Error fetching admin projects:', err);
      setError(err.response?.data?.error || 'An error occurred while loading projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (projectId, projectName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the project "${projectName}"? This will delete all its code history and versions permanently.`);
    if (!confirmDelete) return;

    try {
      setError('');
      setSuccessMsg('');
      const response = await deleteProjectByAdmin(projectId);
      if (response.data && response.data.success) {
        setSuccessMsg(`Project "${projectName}" was deleted successfully.`);
       
        fetchProjects();
      } else {
        setError('Failed to delete project');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err.response?.data?.error || 'An error occurred while trying to delete the project');
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <header className="mb-4">
            <div className="d-flex align-items-center gap-2">
              <Folder className="text-primary" size={28} />
              <div>
                <h1 className="h3 fw-bold mb-0">Manage Projects</h1>
                <p className="text-muted mb-0 small">View, analyze, and remove repositories across the system</p>
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
              <p className="text-muted">Retrieving projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="card text-center p-5 border shadow-sm">
              <Folder size={48} className="text-muted mb-3 mx-auto" />
              <h3 className="h5 fw-bold text-dark">No Projects Found</h3>
              <p className="text-muted">There are currently no code repositories uploaded to the system.</p>
            </div>
          ) : (
            <div className="card shadow-sm border border-light overflow-hidden">
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4 py-3 text-secondary text-uppercase fs-7 fw-bold">Project Name</th>
                      <th className="py-3 text-secondary text-uppercase fs-7 fw-bold">Owner</th>
                      <th className="py-3 text-secondary text-uppercase fs-7 fw-bold">Owner Email</th>
                      <th className="py-3 text-secondary text-uppercase fs-7 fw-bold">Created At</th>
                      <th className="px-4 py-3 text-center text-secondary text-uppercase fs-7 fw-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project._id}>
                        <td className="px-4 py-3 font-semibold text-dark">
                          <div className="d-flex align-items-center gap-2">
                            <Folder className="text-primary opacity-75" size={18} />
                            <span>{project.projectName}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="d-flex align-items-center gap-2 text-muted">
                            <User size={16} />
                            <span>{project.user ? project.user.name : 'Unknown User'}</span>
                          </div>
                        </td>
                        <td className="py-3 text-muted">
                          {project.user ? project.user.email : 'N/A'}
                        </td>
                        <td className="py-3 text-muted">
                          {new Date(project.createdAt).toLocaleDateString([], { dateStyle: 'medium' })}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDelete(project._id, project.projectName)}
                            className="btn btn-sm btn-outline-danger"
                            title={`Delete "${project.projectName}"`}
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

export default SuperProject;
