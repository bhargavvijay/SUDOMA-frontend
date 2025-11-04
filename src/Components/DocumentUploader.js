import React, { useState, useRef } from "react";

const DocumentUploader = ({ documents, setDocuments }) => {
  const fileInputRef = useRef(null);
  
  const supportedFormats = ["PDF", "DOC", "DOCX", "PNG", "JPG"];
  
  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files);
    setDocuments([...documents, ...newFiles]);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setDocuments([...documents, ...newFiles]);
      e.dataTransfer.clearData();
    }
  };
  
  const handleClick = () => {
    fileInputRef.current.click();
  };
  
  const handleRemoveFile = (index) => {
    const updatedDocs = [...documents];
    updatedDocs.splice(index, 1);
    setDocuments(updatedDocs);
  };

  return (
    <div>
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '600', 
        marginBottom: '16px' 
      }}>
        Attach New Documents
      </h3>
      
      {/* Drop zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '40px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        <div style={{ marginBottom: '10px', fontSize: '24px' }}>+</div>
        <div style={{ marginBottom: '10px', color: '#555' }}>
          Click to browse or drag files here
        </div>
        <div style={{ fontSize: '14px', color: '#888' }}>
          Supported formats: {supportedFormats.join(', ')}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          style={{ display: 'none' }}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        />
      </div>
      
      {/* File list */}
      {documents.length > 0 && (
        <div>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '500', 
            marginBottom: '10px' 
          }}>
            Files to Upload:
          </h4>
          
          <div style={{ border: '1px solid #eee', borderRadius: '8px' }}>
            {documents.map((file, index) => (
              <div 
                key={index} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderBottom: index < documents.length - 1 ? '1px solid #eee' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ 
                    marginRight: '10px', 
                    color: '#666' 
                  }}>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </span>
                  <span>{file.name}</span>
                </div>
                <button 
                  onClick={() => handleRemoveFile(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ff6b6b',
                    cursor: 'pointer',
                    padding: '5px'
                  }}
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;