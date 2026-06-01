import React, { useState, useEffect } from 'react';
import AdminService from '../../services/admin-services/Admin-Services';
import { Trash2, Folder, Calendar, User, AlertCircle } from 'lucide-react';
import '../../css/adminstyle/AdminProject.css';

function AdminProjectList() {
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
    <div className="admin-projects-container">
      <div className="admin-projects-header">
        <div className="header-title-wrapper">
          <Folder className="header-icon" size={28} />
          <div>
            <h1>Manage Projects</h1>
            <p>View, analyze, and remove repositories across the system</p>
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
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Retrieving projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <Folder size={48} className="empty-icon" />
          <h3>No Projects Found</h3>
          <p>There are currently no code repositories uploaded to the system.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="projects-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Owner</th>
                <th>Owner Email</th>
                <th>Created At</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id} className="project-row">
                  <td className="project-name-cell">
                    <Folder className="row-folder-icon" size={18} />
                    <span className="project-name-text">{project.projectName}</span>
                  </td>
                  <td className="owner-cell">
                    <User className="row-user-icon" size={16} />
                    <span>{project.user ? project.user.name : 'Unknown User'}</span>
                  </td>
                  <td className="email-cell">
                    <span>{project.user ? project.user.email : 'N/A'}</span>
                  </td>
                  <td className="date-cell">
                    <Calendar className="row-calendar-icon" size={16} />
                    <span>{new Date(project.createdAt).toLocaleDateString([], { dateStyle: 'medium' })}</span>
                  </td>
                  <td className="actions-cell text-center">
                    <button
                      onClick={() => handleDelete(project._id, project.projectName)}
                      className="delete-action-btn"
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
      )}
    </div>
  );
}

export default AdminProjectList;
