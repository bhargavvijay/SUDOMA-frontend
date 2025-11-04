import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const ViewSampleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sampleDetails, setSampleDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSampleDetails = async () => {
      try {
        const response = await fetch(`https://sudoma-backend-api.onrender.com/api/view-sample-details/${id}`, {
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch sample details: ${response.status}`);
        }
        
        const data = await response.json();
        setSampleDetails(data.data);
      } catch (error) {
        console.error(error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSampleDetails();
  }, [id]);

  // Helper function to format field names
  const formatFieldName = (key) => {
    const fieldMap = {
      donorName: "Donor Name",
      bloodGroup: "Blood Group",
      eyeColor: "Eye Color",
      hairColor: "Hair Color",
      skinColor: "Skin Color",
      collectionDate: "Collection Date",
      collectionMethod: "Collection Method",
      collectionPlace: "Collection Place",
      expiryDate: "Expiry Date",
      numberOfVials: "Number of Vials",
      sampleQuantity: "Sample Quantity",
      storagePlace: "Storage Place",
      viralMarkerStatus: "Viral Marker Status",
      viralMarkers: "Viral Markers",
      aadhaarVerified: "Aadhaar Verified",
      issuedToRequest: "Issued To Request",
      bmi: "BMI"
    };
    
    return fieldMap[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
  };

  // Helper function to format field values
  const formatValue = (key, value) => {
    if (value === null || value === undefined) return "-";
    
    switch (key) {
      case "collectionDate":
      case "expiryDate":
        return new Date(value).toLocaleDateString('en-GB');
      case "issued":
      case "aadhaarVerified":
        return value ? "Yes" : "No";
      case "bmi":
        return typeof value === 'number' ? value.toFixed(2) : value;
      case "height":
        return `${value} cm`;
      case "weight":
        return `${value} kg`;
      case "age":
        return `${value} years`;
      default:
        return value.toString();
    }
  };

  // Styles
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f1f4f9",
      padding: "20px",
      minHeight: "100vh",
    },
    card: {
      width: "90%",
      maxWidth: "800px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
      padding: "30px",
    },
    header: {
      color: "#2c3e50",
      fontSize: "32px",
      fontWeight: "600",
      marginBottom: "25px",
      textAlign: "center",
    },
    fieldContainer: {
      marginBottom: "20px",
      textAlign: "left",
    },
    fieldLabel: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#ee3f65",
      marginBottom: "8px",
    },
    fieldValue: {
      fontSize: "16px",
      color: "#34495e",
      margin: 0,
      padding: "10px",
      backgroundColor: "#f8f9fa",
      borderRadius: "5px",
      border: "1px solid #e9ecef",
    },
    documentsContainer: {
      padding: "10px",
      backgroundColor: "#f8f9fa",
      borderRadius: "5px",
      border: "1px solid #e9ecef",
    },
    fileLink: {
      display: "inline-block",
      padding: "8px 15px",
      backgroundColor: "#ffffff",
      color: "#2c3e50",
      borderRadius: "5px",
      textDecoration: "none",
      margin: "5px 0",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
      border: "1px solid #ddd",
      fontSize: "14px",
    },
    backButton: {
      marginTop: "30px",
      padding: "12px 25px",
      backgroundColor: "#ee3f65",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      cursor: "pointer",
      fontWeight: "500",
      transition: "background-color 0.3s ease",
    },
    errorContainer: {
      textAlign: "center",
      padding: "20px",
      color: "#dc3545",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "20px",
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <p>Loading sample details...</p>
        </div>
      </div>
    );
  }

  if (error || !sampleDetails) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.errorContainer}>
            <p>{error || "Sample details not available."}</p>
            <button
              onClick={() => navigate(-1)}
              style={styles.backButton}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Extract documents and other details (note: fixed typo from 'documnents' to 'documents')
  const { documents = [], aadhaarData, ...otherDetails } = sampleDetails;

  // Filter out unwanted fields
  const filteredDetails = Object.entries(otherDetails).filter(
    ([key, value]) => 
      value != null && 
      value !== "" && 
      !["_id", "__v"].includes(key)
  );

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.header}>Sample Details</h1>

        {/* Display sample details */}
        <div style={{ display: "grid", gap: "20px" }}>
          {filteredDetails.map(([key, value]) => (
            <div key={key} style={styles.fieldContainer}>
              <p style={styles.fieldLabel}>
                {formatFieldName(key)}
              </p>
              <p style={styles.fieldValue}>
                {formatValue(key, value)}
              </p>
            </div>
          ))}

          {/* Display Aadhaar Information */}
          {aadhaarData && (
            <div style={styles.fieldContainer}>
              <p style={styles.fieldLabel}>Aadhaar Information</p>
              <div style={styles.documentsContainer}>
                <p><strong>Name:</strong> {aadhaarData.name}</p>
                <p><strong>Date of Birth:</strong> {aadhaarData.dateOfBirth}</p>
                <p><strong>Gender:</strong> {aadhaarData.gender}</p>
                <p><strong>Masked Number:</strong> {aadhaarData.maskedNumber}</p>
                {aadhaarData.address && (
                  <div>
                    <p><strong>Address:</strong></p>
                    <p style={{ marginLeft: "10px", fontSize: "14px", color: "#666" }}>
                      {[
                        aadhaarData.address.house,
                        aadhaarData.address.street,
                        aadhaarData.address.locality,
                        aadhaarData.address.district,
                        aadhaarData.address.state,
                        aadhaarData.address.pin
                      ].filter(Boolean).join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Display Documents Section */}
          {documents && documents.length > 0 && (
            <div style={styles.fieldContainer}>
              <p style={styles.fieldLabel}>Documents</p>
              <div style={styles.documentsContainer}>
                {documents.map((doc, index) => (
                  <div key={index} style={{ margin: "8px 0" }}>
                    <a
                      href={`https://sudoma-backend-api.onrender.com/api/documents/${encodeURIComponent(doc.split('\\').pop())}`}
                      style={styles.fileLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📄 {doc.split('\\').pop()}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show message if no documents */}
          {(!documents || documents.length === 0) && (
            <div style={styles.fieldContainer}>
              <p style={styles.fieldLabel}>Documents</p>
              <p style={styles.fieldValue}>No documents available</p>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate(-1)}
            style={styles.backButton}
            onMouseOver={(e) => e.target.style.backgroundColor = "#d73653"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#ee3f65"}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewSampleDetails;