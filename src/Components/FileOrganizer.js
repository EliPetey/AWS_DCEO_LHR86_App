import React, { useState } from 'react';
import { API, Storage } from 'aws-amplify';
import './FileOrganizer.css';

const FileOrganizer = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [organizing, setOrganizing] = useState(false);
  const [organizedFiles, setOrganizedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setError(null);
    
    try {
      const uploadPromises = files.map(async (file) => {
        const fileName = `uploads/${Date.now()}-${file.name}`;
        await Storage.put(fileName, file, {
          contentType: file.type,
          metadata: {
            uploadedBy: 'current-user-id', // Replace with actual user ID
            originalName: file.name
          }
        });
        return fileName;
      });
      
      const uploadedFiles = await Promise.all(uploadPromises);
      
      // Trigger organization process
      setOrganizing(true);
      
      // In a real implementation, this would be triggered by S3 events
      // Here we're simulating the process
      setTimeout(() => {
        const mockOrganizedFiles = uploadedFiles.map(file => ({
          fileId: `file_${Math.random().toString(36).substr(2, 9)}`,
          originalKey: file,
          organizedKey: `procedures/maintenance/${file.split('/').pop()}`,
          classification: {
            primaryCategory: 'procedures',
            subcategory: 'maintenance',
            folderPath: 'procedures/maintenance',
            keywords: ['maintenance', 'schedule', 'preventive'],
            summary: 'Maintenance procedure document'
          }
        }));
        
        setOrganizedFiles(mockOrganizedFiles);
        setOrganizing(false);
        setActiveTab('results');
      }, 3000);
      
      setFiles([]);
    } catch (err) {
      console.error('Error uploading files:', err);
      setError('Failed to upload files. Please try again.');
      setOrganizing(false);
    } finally {
      setUploading(false);
    }
  };

  const provideFeedback = async (fileId, feedback, correctCategory, correctPath) => {
    try {
      await API.post('knowledgeAPI', '/feedback', {
        body: {
          fileId,
          feedback,
          correctCategory,
          correctPath,
          engineerId: 'current-user-id' // Replace with actual user ID
        }
      });
      
      // Update UI to show feedback was provided
      setOrganizedFiles(prev => 
        prev.map(file => 
          file.fileId === fileId 
            ? {...file, feedbackProvided: true} 
            : file
        )
      );
    } catch (err) {
      console.error('Error providing feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="file-organizer">
      <div className="organizer-header">
        <h2>📁 AI File Organizer</h2>
        <p>Upload files and let our AI organize them based on expert knowledge</p>
        
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload Files
          </button>
          <button 
            className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
            disabled={organizedFiles.length === 0}
          >
            Results
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {activeTab === 'upload' ? (
        <div className="upload-section">
          <div className="file-upload-area">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              id="file-upload"
              className="file-input"
              disabled={uploading || organizing}
            />
            <label htmlFor="file-upload" className="file-label">
              {uploading ? 'Uploading...' : 'Choose Files or Drop Here'}
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
              onClick={uploadFiles} 
              disabled={files.length === 0 || uploading || organizing}
              className="upload-btn"
            >
              {uploading ? 'Uploading...' : organizing ? 'Organizing...' : 'Upload & Organize'}
            </button>
          </div>
          
          {organizing && (
            <div className="organizing-indicator">
              <div className="spinner"></div>
              <p>AI is organizing your files...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="results-section">
          <h3>Organized Files</h3>
          
          {organizedFiles.length === 0 ? (
            <p>No organized files yet. Upload some files first!</p>
          ) : (
            <div className="organized-files-list">
              {organizedFiles.map((file, index) => (
                <div key={index} className="organized-file-card">
                  <div className="file-info">
                    <h4>{file.originalKey.split('/').pop()}</h4>
                    <p>
                      <strong>Category:</strong> {file.classification.primaryCategory} &gt; {file.classification.subcategory}
                    </p>
                    <p>
                      <strong>Path:</strong> {file.classification.folderPath}
                    </p>
                    <p>
                      <strong>Keywords:</strong> {file.classification.keywords.join(', ')}
                    </p>
                    <p>
                      <strong>Summary:</strong> {file.classification.summary}
                    </p>
                  </div>
                  
                  {!file.feedbackProvided ? (
                    <div className="feedback-section">
                      <h5>Is this classification correct?</h5>
                      <div className="feedback-buttons">
                        <button 
                          onClick={() => provideFeedback(file.fileId, 'Correct classification', null, null)}
                          className="feedback-btn correct"
                        >
                          ✓ Yes, it's correct
                        </button>
                        <button 
                          onClick={() => {
                            const feedback = prompt('Please provide feedback on the classification:');
                            const correctCategory = prompt('What would be the correct category?');
                            const correctPath = prompt('What would be the correct path?');
                            
                            if (feedback) {
                              provideFeedback(file.fileId, feedback, correctCategory, correctPath);
                            }
                          }}
                          className="feedback-btn incorrect"
                        >
                          ✗ No, suggest correction
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="feedback-provided">
                      <p>✓ Feedback provided</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileOrganizer;