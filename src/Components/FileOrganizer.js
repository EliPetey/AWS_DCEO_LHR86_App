import React, { useState } from 'react';
import './FileOrganizer.css';

const FileOrganizer = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = () => {
    if (files.length > 0) {
      alert(`Selected ${files.length} files for upload!`);
      setFiles([]);
    }
  };

  return (
    <div className="file-organizer">
      <div className="organizer-header">
        <h2>📁 AI File Organizer</h2>
        <p>Upload files and let our AI organize them based on expert knowledge</p>
      </div>

      <div className="upload-section">
        <div className="file-upload-area">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            id="file-upload"
            className="file-input"
          />
          <label htmlFor="file-upload" className="file-label">
            Choose Files or Drop Here
          </label>
          
          {files.length > 0 && (
            <div className="selected-files">
              <h4>Selected Files ({files.length})</h4>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <button 
            onClick={handleUpload} 
            disabled={files.length === 0}
            className="upload-btn"
          >
            Upload Files
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileOrganizer;