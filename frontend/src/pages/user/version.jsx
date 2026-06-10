import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserService from '../../services/user-services/User-Service';
import '../../css/userstyle/version.css';


function Version() {
  const {
    getMyProjects,
    getProjectById,
    addProjectVersion,
    deleteProjectVersion
  } = UserService();
  const location = useLocation();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectData, setProjectData] = useState(null);

  const [selectedVersionNum, setSelectedVersionNum] = useState(null);
  const [code, setCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  const fetchProjects = async (targetId) => {
    try {
      const response = await getMyProjects();
      if (response.data && response.data.success) {
        const projs = response.data.data;
        setProjects(projs);


        const idToSelect = targetId || (location.state && location.state.projectId) || (projs.length > 0 ? projs[0]._id : null);
        if (idToSelect) {
          setSelectedProjectId(idToSelect);
          fetchProjectDetails(idToSelect);
        }
      }
    } catch (err) {
      console.error("Error fetching projects", err);
      setError("Failed to load projects list.");
    }
  };

  useEffect(() => {
    const startId = location.state && location.state.projectId;
    fetchProjects(startId);
  }, [location.state]);


  const fetchProjectDetails = async (projectId) => {
    if (!projectId) {
      setProjectData(null);
      setSelectedVersionNum(null);
      setCode('');
      setIsEditing(false);
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await getProjectById(projectId);
      if (response.data && response.data.success) {
        const proj = response.data.data;
        setProjectData(proj);


        if (proj.versions && proj.versions.length > 0) {
          const latestVerObj = proj.versions[proj.versions.length - 1];
          setSelectedVersionNum(latestVerObj.versionNumber);
          setCode(latestVerObj.code);
        } else {
          setSelectedVersionNum(1);
          setCode(proj.code || '');
        }
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error fetching project details", err);
      setError("Failed to load project version history.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVersion = (verNum) => {
    if (!projectData || !projectData.versions) return;

    const versionObj = projectData.versions.find(v => v.versionNumber === verNum);
    if (versionObj) {
      setSelectedVersionNum(verNum);
      setCode(versionObj.code);
      setIsEditing(false);
      setMessage('');
      setError('');
    }
  };

  const handleSaveVersion = async () => {
    if (!selectedProjectId || !code.trim()) {
      setError("Cannot save empty code.");
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await addProjectVersion(selectedProjectId, { code });
      if (response.data && response.data.success) {
        setMessage(`Successfully saved new Version ${response.data.data.versions.length}!`);

        const updatedProj = response.data.data;
        setProjectData(updatedProj);


        const latestVerObj = updatedProj.versions[updatedProj.versions.length - 1];
        setSelectedVersionNum(latestVerObj.versionNumber);
        setCode(latestVerObj.code);
        setIsEditing(false);


        window.dispatchEvent(new Event('filesUpdated'));
      }
    } catch (err) {
      console.error("Error saving new version", err);
      setError(err.response?.data?.error || "Failed to save new version.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVersion = async (verNum) => {
    if (!selectedProjectId) {
      setError("No project selected.");
      return;
    }

    if (projectData.versions.length <= 1) {
      setError("Cannot delete the only remaining version of a project.");
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete Version ${verNum}? This action cannot be undone.`);
    if (!confirmDelete) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await deleteProjectVersion(selectedProjectId, verNum);
      if (response.data && response.data.success) {
        setMessage(`Successfully deleted Version ${verNum}!`);

        const updatedProj = response.data.data;
        setProjectData(updatedProj);


        const remainingVersions = updatedProj.versions || [];
        if (remainingVersions.length > 0) {
          const stillExists = remainingVersions.some(v => v.versionNumber === selectedVersionNum);
          const nextSelectedVer = stillExists ? selectedVersionNum : remainingVersions[remainingVersions.length - 1].versionNumber;

          setSelectedVersionNum(nextSelectedVer);
          const versionObj = remainingVersions.find(v => v.versionNumber === nextSelectedVer);
          if (versionObj) {
            setCode(versionObj.code);
          }
        }
        setIsEditing(false);


        window.dispatchEvent(new Event('filesUpdated'));
      }
    } catch (err) {
      console.error("Error deleting version", err);
      setError(err.response?.data?.error || "Failed to delete version.");
    } finally {
      setSaving(false);
    }
  };

  const handleLoadIntoUpload = (versionObj) => {
    if (!projectData) return;
    navigate('/user/upload', {
      state: {
        projectName: projectData.projectName,
        code: versionObj.code
      }
    });
  };


  const getPreviousVersionObj = () => {
    if (!projectData || !projectData.versions || !selectedVersionNum) return null;
    const sorted = [...projectData.versions].sort((a, b) => b.versionNumber - a.versionNumber);
    return sorted.find(v => v.versionNumber < selectedVersionNum) || null;
  };


  const diffResult = useMemo(() => {
    const prevVerObj = getPreviousVersionObj();
    if (!prevVerObj) return [];

    const linesA = prevVerObj.code.replace(/\r/g, '').split('\n');
    const linesB = code.replace(/\r/g, '').split('\n');
    const n = linesA.length;
    const m = linesB.length;

    const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        if (linesA[i - 1] === linesB[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    let i = n, j = m;
    const diff = [];
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
        diff.unshift({ type: 'unchanged', text: linesA[i - 1], lineA: i, lineB: j });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        diff.unshift({ type: 'added', text: linesB[j - 1], lineA: '', lineB: j });
        j--;
      } else {
        diff.unshift({ type: 'removed', text: linesA[i - 1], lineA: i, lineB: '' });
        i--;
      }
    }
    return diff;
  }, [projectData, selectedVersionNum, code]);


  return (
    <div className="version-page-container">

      <div className="versions-sidebar">
        <h3 className="panel-title">
          Version Control
        </h3>



        <div className="versions-list-section">
          {loading ? (
            <p className="status-text text-loading">Loading history...</p>
          ) : projectData && projectData.versions && projectData.versions.length > 0 ? (
            <div className="versions-buttons-grid">
              {projectData.versions.map((v) => (
                <div
                  key={v.versionNumber}
                  className={`version-item-container ${selectedVersionNum === v.versionNumber ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectVersion(v.versionNumber)}
                    className="version-select-btn"
                  >
                    <span className="version-number-lbl">Version {v.versionNumber}</span>
                    <span className="version-date">
                      {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </button>
                  <div className="version-item-actions">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoadIntoUpload(v);
                      }}
                      className="version-action-btn save-btn"
                      title="Saved"
                      disabled={saving}
                    >
                      <i className="fa-solid fa-floppy-disk" style={{ fontSize: '14px' }}></i>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVersion(v.versionNumber);
                      }}
                      className="version-action-btn delete-btn"
                      title={`Delete Version ${v.versionNumber}`}
                      disabled={saving}
                    >
                      <i className="fa-solid fa-trash" style={{ fontSize: '14px' }}></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedProjectId ? (
            <p className="no-history-text">No versions found.</p>
          ) : (
            <p className="select-project-prompt">Please upload a file to view versions.</p>
          )}
        </div>
      </div>


      <div className="code-workspace">
        {projectData ? (
          <div className="editor-container">
            <div className="editor-header">
              <div className="editor-title-group">
                <i className="fa-solid fa-file-code editor-title-icon" style={{ fontSize: '20px' }}></i>
                <div>
                  <h3 className="editor-project-name">{projectData.projectName}</h3>
                  <p className="editor-meta">
                    Viewing <strong>Version {selectedVersionNum}</strong>
                  </p>
                </div>
              </div>

              <div className="editor-actions">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`editor-btn btn-edit ${isEditing ? 'editing' : ''}`}
                  title={isEditing ? "Lock Editing" : "Enable Editing"}
                >
                  <i className="fa-solid fa-pen-to-square" style={{ fontSize: '16px' }}></i>
                  <span>{isEditing ? 'Lock Code' : 'Edit Code'}</span>
                </button>

                <button
                  onClick={handleSaveVersion}
                  disabled={saving || !isEditing || !code.trim()}
                  className="editor-btn btn-save"
                  title="Save as next version"
                >
                  <i className="fa-solid fa-floppy-disk" style={{ fontSize: '16px' }}></i>
                  <span>{saving ? 'Saving...' : 'Save Version'}</span>
                </button>
              </div>
            </div>

            {message && (
              <div className="alert alert-success">
                <i className="fa-solid fa-circle-check" style={{ fontSize: '16px' }}></i>
                <span>{message}</span>
              </div>
            )}
            {error && (
              <div className="alert alert-error">
                <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '16px' }}></i>
                <span>{error}</span>
              </div>
            )}

            <div className="editor-textarea-wrapper">
              {isEditing ? (
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="editor-textarea editable"
                  placeholder="Selected version's code content..."
                />
              ) : (
                <div className="version-code-viewer code-monospace">
                  {getPreviousVersionObj() ? (
                    <div className="version-diff-lines">
                      {diffResult.map((line, idx) => {
                        let className = '';
                        let marker = ' ';
                        if (line.type === 'added') {
                          className = 'line-added';
                          marker = '+';
                        } else if (line.type === 'removed') {
                          className = 'line-removed';
                          marker = '-';
                        }

                        return (
                          <div key={idx} className={`version-diff-line-row ${className}`}>
                            <span className="version-line-number number-a">{line.lineA}</span>
                            <span className="version-line-number number-b">{line.lineB}</span>
                            <span className="version-diff-line-marker">{marker}</span>
                            <pre className="version-diff-line-content">{line.text || ' '}</pre>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="version-plain-lines">
                      {code.replace(/\r/g, '').split('\n').map((line, idx) => (
                        <div key={idx} className="version-plain-line-row">
                          <span className="version-plain-line-number">{idx + 1}</span>
                          <span className="version-diff-line-marker"> </span>
                          <pre className="version-plain-line-content">{line || ' '}</pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="editor-placeholder">
            <i className="fa-solid fa-file-code placeholder-icon" style={{ fontSize: '48px' }}></i>
            <h3>No File Selected</h3>
            <p>Select a project file from the left sidebar to display, edit, and track versions of your code.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Version;
