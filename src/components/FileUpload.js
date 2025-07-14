import React, { useRef } from 'react';

const FileUpload = ({ onFileSelect, selectedFile }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['.pdf', '.docx', '.doc', '.txt', '.png', '.jpg', '.jpeg'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (allowedTypes.includes(fileExtension)) {
        onFileSelect(file);
      } else {
        alert('Please select a valid file type: PDF, DOCX, DOC, TXT, PNG, JPG');
        event.target.value = '';
      }
    }
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
        style={{ display: 'none' }}
      />
      
      {selectedFile ? (
        <div className="selected-file">
          <span>📎 {selectedFile.name}</span>
          <button onClick={handleRemoveFile} className="remove-file-btn">
            ✕
          </button>
        </div>
      ) : (
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="upload-btn"
        >
          📎 Upload File
        </button>
      )}
    </div>
  );
};

export default FileUpload;