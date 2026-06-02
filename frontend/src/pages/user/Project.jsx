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
    <div className="upload-page-wrapper py-5 px-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
            <div className="upload-container shadow border rounded-3 p-4 p-md-5 bg-white">
              <h2 className="upload-title text-center fw-bold mb-4 text-dark fs-3">Upload Code Project</h2>

              {message && <div className="alert alert-success py-2 px-3 mb-3 text-start" role="alert">{message}</div>}
              {error && <div className="alert alert-danger py-2 px-3 mb-3 text-start" role="alert">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small" htmlFor="projectName">Project Name</label>
                  <input
                    type="text"
                    id="projectName"
                    className="form-control form-control-lg fs-6"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. My Awesome Web App"
                    required
                  />
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label fw-semibold text-secondary small mb-0" htmlFor="codeSpace">Enter the Code</label>
                    <div className="d-flex gap-2">
                      <label className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1" title="Import code from file" style={{ cursor: 'pointer' }}>
                        <span>Import File</span>
                        <input
                          type="file"
                          onChange={handleImportFile}
                          style={{ display: 'none' }}
                        />
                      </label>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={handleClearCode}
                        title="Clear code space"
                      >
                        Clear Code
                      </button>
                    </div>
                  </div>
                  <textarea
                    id="codeSpace"
                    className="form-control font-monospace fs-6"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste or write your code here..."
                    style={{ height: '250px', resize: 'vertical' }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2.5 fw-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Uploading...</span>
                    </span>
                  ) : 'Upload Project'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Project;
