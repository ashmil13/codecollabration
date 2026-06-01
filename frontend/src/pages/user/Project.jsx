import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import UserService from '../../services/user-services/User-Service';
import '../../css/userstyle/project.css';

function Project() {
  const location = useLocation();
  const { createProject } = UserService();
  const [projectName, setProjectName] = useState('');
  const [code, setCode] = useState('');

  console.log(projectName,"===projectName");
  

  useEffect(() => {
    if (location.state) {
      if (location.state.projectName) {
        setProjectName(location.state.projectName);
      }
      if (location.state.code) {
        setCode(location.state.code);
      }
    }
  }, [location.state]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleClearCode = (e) => {
    e.preventDefault();
    setCode('');
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;


    if (!projectName.trim()) {
      const nameWithoutExtension = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setProjectName(nameWithoutExtension);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target.result);
    };
    reader.onerror = (err) => {
      setError('Failed to read the file.');
      console.error(err);
    };
    reader.readAsText(file);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim() || !code.trim()) {
      setError('Please fill in both project name and code.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await createProject({ projectName, code });
      if (response.data && response.data.success) {
        setMessage('Project uploaded successfully!');

        const stored = localStorage.getItem("uploadedFiles");
        const existingFiles = stored ? JSON.parse(stored) : [];
        const updatedFiles = [...existingFiles, projectName];
        localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));

      
        window.dispatchEvent(new Event('filesUpdated'));
        setProjectName('');
        setCode('');
        
      } else {
        throw new Error(response.data.error || 'Failed to upload project.');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page-wrapper">
      <div className="upload-container">
        <h2 className="upload-title">Upload Code Project</h2>

        {message && <p className="upload-success">{message}</p>}
        {error && <p className="upload-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="upload-form-group">
            <label className="upload-label" htmlFor="projectName">Project Name</label>
            <input
              type="text"
              id="projectName"
              className="upload-input"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. My Awesome Web App"
              required
            />
          </div>

          <div className="upload-form-group code-group">
            <div className="code-header">
              <label className="upload-label" htmlFor="codeSpace">Enter the Code</label>
              <div className="code-actions">
                <label className="import-file-btn" title="Import code from file">
                  Import File
                  <input
                    type="file"
                    onChange={handleImportFile}
                    style={{ display: 'none' }}
                  />
                </label>
                <button
                  type="button"
                  className="clear-code-btn"
                  onClick={handleClearCode}
                  title="Clear code space"
                >
                  Clear Code
                </button>
              </div>
            </div>
            <textarea
              id="codeSpace"
              className="upload-textarea"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste or write your code here..."
              required
            />
          </div>

          <button
            type="submit"
            className="upload-btn"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Project'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Project;
