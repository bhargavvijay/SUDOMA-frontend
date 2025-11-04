import React, { useState } from "react";

export const ViewArtBank = ({ bankDetails, setViewArtBank }) => {
  const [viewingDocument, setViewingDocument] = useState(null);
  
  if (!bankDetails) {
    setViewArtBank(false);
    return null;
  }

  // Secure document viewer component
  const SecureDocumentViewer = ({ documentUrl, fileName, onClose }) => {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none" // Prevent text selection
      }} onContextMenu={(e) => e.preventDefault()}>
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflow: "hidden",
          position: "relative"
        }}>
          <div style={{
            padding: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#ee3f65",
            color: "white"
          }}>
            <h3 style={{ margin: 0 }}>Secure Document Viewer</h3>
            <button 
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "white"
              }}
            >
              &times;
            </button>
          </div>
          
          <div style={{
            height: "70vh", 
            overflow: "hidden",
            position: "relative"
          }}>
            {/* Using object tag which supports PDF, images, and other document types */}
            <object
              data={documentUrl}
              type="application/pdf"
              width="100%"
              height="100%"
              style={{
                backgroundColor: "#f8f9fa"
              }}
            >
              <embed 
                src={documentUrl} 
                type="application/pdf" 
                width="100%" 
                height="100%" 
              />
              <p style={{ 
                textAlign: "center", 
                padding: "20px", 
                color: "#666" 
              }}>
                Unable to display this document. Please check your browser settings or download a compatible viewer.
              </p>
            </object>
            
            {/* Transparent overlay with watermark to prevent easy screenshots */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "none",
              backgroundImage: `repeating-linear-gradient(45deg, rgba(238, 63, 101, 0.03), rgba(238, 63, 101, 0.03) 10px, rgba(238, 63, 101, 0.06) 10px, rgba(238, 63, 101, 0.06) 20px)`,
            }}></div>
            
            {/* Center watermark */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-30deg)",
              opacity: 0.1,
              fontSize: "80px",
              color: "#ee3f65",
              fontWeight: "bold",
              pointerEvents: "none",
              whiteSpace: "nowrap"
            }}>
              CONFIDENTIAL
            </div>
          </div>
          
          <div style={{
            padding: "15px",
            borderTop: "1px solid #ddd",
            textAlign: "center",
            backgroundColor: "#f8f9fa"
          }}>
            <p style={{ color: "#ee3f65", margin: 0, fontWeight: "bold" }}>
              This document is protected. Screenshots and downloads are prohibited.
            </p>
            <p style={{ fontSize: "12px", color: "#666", margin: "5px 0 0 0" }}>
              Document ID: {fileName} • Accessed on {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const styles = {
    fileLink: {
      fontSize: "16px",
      color: "grey",
      textDecoration: "none",
      padding: "10px 15px",
      backgroundColor: "#ffffff",
      borderRadius: "5px",
      border: "1px solid #ddd",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "8px",
      cursor: "pointer"
    }
  };

  // Function to handle document viewing
  const handleDocumentView = (fileName) => {
    const documentUrl = `http://localhost:4000/api/documents/${encodeURIComponent(fileName)}`;
    setViewingDocument({ url: documentUrl, name: fileName });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f1f4f9",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      {viewingDocument && (
        <SecureDocumentViewer 
          documentUrl={viewingDocument.url} 
          fileName={viewingDocument.name}
          onClose={() => setViewingDocument(null)} 
        />
      )}
      
      <div
        style={{
          width: "90%",
          maxWidth: "700px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#2c3e50",
            fontSize: "32px",
            fontWeight: "600",
            marginBottom: "25px",
          }}
        >
          View ART Bank
        </h1>

        {/* Bank Name */}
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <p style={{ fontSize: "18px", fontWeight: "600", color: "#ee3f65", marginBottom: "8px" }}>
            Name of ART Bank
          </p>
          <p
            style={{
              fontSize: "16px",
              color: "#34495e",
              margin: 0,
              padding: "5px",
              backgroundColor: "#f8f9fa",
              borderRadius: "5px",
            }}
          >
            {bankDetails.name}
          </p>
        </div>

        {/* Director Name */}
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <p style={{ fontSize: "18px", fontWeight: "600", color: "#ee3f65", marginBottom: "8px" }}>
            Name of the Director
          </p>
          <p
            style={{
              fontSize: "16px",
              color: "#34495e",
              margin: 0,
              padding: "5px",
              backgroundColor: "#f8f9fa",
              borderRadius: "5px",
            }}
          >
            {bankDetails.directorName}
          </p>
        </div>

        {/* Registration ID */}
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <p style={{ fontSize: "18px", fontWeight: "600", color: "#ee3f65", marginBottom: "8px" }}>
            Registration ID
          </p>
          <p
            style={{
              fontSize: "16px",
              color: "#34495e",
              margin: 0,
              padding: "5px",
              backgroundColor: "#f8f9fa",
              borderRadius: "5px",
            }}
          >
            {bankDetails.registrationId}
          </p>
        </div>

        {/* Address */}
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <p style={{ fontSize: "18px", fontWeight: "600", color: "#ee3f65", marginBottom: "8px" }}>
            Address
          </p>
          <p
            style={{
              fontSize: "16px",
              color: "#34495e",
              margin: 0,
              padding: "5px",
              backgroundColor: "#f8f9fa",
              borderRadius: "5px",
            }}
          >
            {bankDetails.address}
          </p>
        </div>

        {/* aadhaarNumber */}
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <p style={{ fontSize: "18px", fontWeight: "600", color: "#ee3f65", marginBottom: "8px" }}>
            Aadhaar Number
          </p>
          <p
            style={{
              fontSize: "16px",
              color: "#34495e",
              margin: 0,
              padding: "5px",
              backgroundColor: "#f8f9fa",
              borderRadius: "5px",
            }}
          >
            {bankDetails.aadharNumber}
          </p>
        </div>

        {/* PAN Number */}
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <p style={{ fontSize: "18px", fontWeight: "600", color: "#ee3f65", marginBottom: "8px" }}>
            PAN Number
          </p>
          <p
            style={{
              fontSize: "16px",
              color: "#34495e",
              margin: 0,
              padding: "5px",
              backgroundColor: "#f8f9fa",
              borderRadius: "5px",
            }}
          >
            {bankDetails.panNumber}
          </p>
        </div>

        {/* Donor Semen Price */}
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <p style={{ fontSize: "18px", fontWeight: "600", color: "#ee3f65", marginBottom: "8px" }}>
            Donor Semen Price
          </p>
          <p
            style={{
              fontSize: "16px",
              color: "#34495e",
              margin: 0,
              padding: "5px",
              backgroundColor: "#f8f9fa",
              borderRadius: "5px",
            }}
          >
            ₹{bankDetails.donorSemenPrice}
          </p>
        </div>

        {/* Donor Oocyte Price */}
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <p style={{ fontSize: "18px", fontWeight: "600", color: "#ee3f65", marginBottom: "8px" }}>
            Donor Oocyte Price
          </p>
          <p
            style={{
              fontSize: "16px",
              color: "#34495e",
              margin: 0,
              padding: "5px",
              backgroundColor: "#f8f9fa",
              borderRadius: "5px",
            }}
          >
            ₹{bankDetails.oocyteDonorPrice}
          </p>
        </div>

        {/* Surrogate Mother Price */}
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <p style={{ fontSize: "18px", fontWeight: "600", color: "#ee3f65", marginBottom: "8px" }}>
            Surrogate Mother Price
          </p>
          <p
            style={{
              fontSize: "16px",
              color: "#34495e",
              margin: 0,
              padding: "5px",
              backgroundColor: "#f8f9fa",
              borderRadius: "5px",
            }}
          >
            ₹{bankDetails.surrogateMotherPrice}
          </p>
        </div>

        {/* Documents */}
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <p style={{ fontSize: "18px", fontWeight: "600", color: "#ee3f65", marginBottom: "8px" }}>
            Documents
          </p>
          {bankDetails.documents && bankDetails.documents.length > 0 ? (
            <div style={{ 
              backgroundColor: "#f8f9fa",
              padding: "10px",
              borderRadius: "5px" 
            }}>
              {bankDetails.documents.map((doc, index) => {
                const fileName = doc.split('\\').pop();
                console.log("File Name: ", fileName);
                
                return (
                  <div 
                    key={index}
                    onClick={() => handleDocumentView(fileName)}
                    style={styles.fileLink}
                  >
                    <span>{fileName}</span>
                    <span style={{ 
                      backgroundColor: "#ee3f65", 
                      color: "#fff", 
                      padding: "3px 8px", 
                      borderRadius: "4px",
                      fontSize: "14px"
                    }}>
                      View Securely
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p
              style={{
                fontSize: "16px",
                color: "#34495e",
                margin: 0,
                padding: "5px",
                backgroundColor: "#f8f9fa",
                borderRadius: "5px",
              }}
            >
              No documents available
            </p>
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={() => setViewArtBank(false)}
          style={{
            marginTop: "30px",
            padding: "12px 25px",
            backgroundColor: "#ee3f65",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
};