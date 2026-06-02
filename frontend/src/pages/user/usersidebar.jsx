import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, LogOut, User, File, Trash2, Pencil } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import UserService from '../../services/user-services/User-Service';
import '../../css/userstyle/usersidebar.css';

function UserSidebar() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const { getMyProjects, deleteProject } = UserService();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const loadFiles = async () => {
    if (auth?.accessToken) {
      try {
        const response = await getMyProjects();
        if (response.data && response.data.success) {
          setUploadedFiles(response.data.data);
          localStorage.setItem("uploadedFiles", JSON.stringify(response.data.data));
        }
      } catch (e) {
        console.error("Error fetching projects from backend, falling back to localStorage", e);
        const stored = localStorage.getItem("uploadedFiles");
        if (stored) {
          try {
            setUploadedFiles(JSON.parse(stored));
          } catch (err) {
            setUploadedFiles([]);
          }
        }
      }
    } else {
      const stored = localStorage.getItem("uploadedFiles");
      if (stored) {
        try {
          setUploadedFiles(JSON.parse(stored));
        } catch (err) {
          setUploadedFiles([]);
        }
      } else {
        setUploadedFiles([]);
      }
    }
  };

  useEffect(() => {
    loadFiles();


    window.addEventListener('storage', loadFiles);
    window.addEventListener('filesUpdated', loadFiles);

    return () => {
      window.removeEventListener('storage', loadFiles);
      window.removeEventListener('filesUpdated', loadFiles);
    };
  }, [auth?.accessToken]);

  const handleEditClick = (projectId) => {
    navigate('/user/version', { state: { projectId } });
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the project "${name}"?`)) {
      try {
        const response = await deleteProject(id);
        if (response.data && response.data.success) {
          alert("Project deleted successfully!");
          loadFiles();
        }
      } catch (e) {
        console.error("Error deleting project", e);
        alert(e.response?.data?.error || "Failed to delete project.");
      }
    }
  };

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
    <div className={`simple-sidebar ${isOpen ? 'show-mobile' : ''}`}>
      {/* Mobile Header with Toggle Button */}
      <div className="sidebar-mobile-header d-md-none d-flex justify-content-between align-items-center w-100 px-3 py-2 border-bottom">
        <span className="fw-bold text-dark fs-5">CodeCollab</span>
        <button 
          type="button" 
          className="btn btn-sm btn-outline-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Close Menu' : 'Open Menu'}
        </button>
      </div>

      {/* Main Sidebar Contents - visible on desktop, hidden on mobile unless toggled open */}
      <div className={`sidebar-content-wrapper d-none d-md-flex flex-column h-100 w-100 ${isOpen ? 'd-flex-important' : ''}`}>
        <div className="sidebar-user-info">
          <div className="user-avatar">
            {auth?.name ? (
              <span className="avatar-initials">{auth.name.charAt(0).toUpperCase()}</span>
            ) : (
              <User size={30} />
            )}
          </div>
          <h3 className="user-name">{auth?.name || "Guest User"}</h3>
        </div>

        <div className="sidebar-menu">
          <Link to="/user/upload" className="menu-item" onClick={() => setIsOpen(false)}>
            <Upload size={20} />
            <span>Upload</span>
          </Link>
        </div>

        <div className="uploaded-files-section">
          <h4 className="section-title">Uploaded Files</h4>
          {uploadedFiles.length > 0 ? (
            <ul className="file-list">
              {uploadedFiles.map((file, index) => {
                const isObject = typeof file === 'object' && file !== null;
                const fileName = isObject ? file.projectName : file;
                const fileId = isObject ? file._id : null;

                return (
                  <li key={fileId || index} className="file-item" title={fileName}>
                    <div className="file-info" style={{ cursor: 'pointer' }} onClick={() => { if (fileId) { handleEditClick(fileId); setIsOpen(false); } }}>
                      <File size={16} className="file-icon" />
                      <span className="file-name-text">{fileName}</span>
                    </div>
                    
                    <div className="file-actions-btns">
                      {fileId && (
                        <button 
                          onClick={() => { handleEditClick(fileId); setIsOpen(false); }} 
                          className="edit-file-btn"
                          title="Edit / Version Control"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      {fileId && (
                        <button 
                          onClick={() => handleDelete(fileId, fileName)} 
                          className="delete-file-btn"
                          title="Delete project"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="no-files-text">No files uploaded yet</p>
          )}
        </div>

        <div className="sidebar-bottom mt-auto">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserSidebar;
