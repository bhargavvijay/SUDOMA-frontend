import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const ViewOocyteDonorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sampleDetails, setSampleDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSampleDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/view-oocyte-donor-details/${id}`, {
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch donor details: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
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
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Helper function to format field values
  const formatFieldValue = (key, value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }
    
    if (key.toLowerCase().includes("date")) {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }
    
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    
    // Handle address object
    if (typeof value === "object" && (value.house || value.street || value.district)) {
      const addressParts = [];
      
      if (value.house) addressParts.push(value.house);
      if (value.street) addressParts.push(value.street);
      if (value.landmark) addressParts.push(value.landmark);
      if (value.locality) addressParts.push(value.locality);
      if (value.district) addressParts.push(value.district);
      if (value.state) addressParts.push(value.state);
      if (value.pin) addressParts.push(value.pin);
      if (value.country) addressParts.push(value.country);
      
      const formattedAddress = addressParts.join(", ");
      
      // Add care of information if available
      if (value.careOf) {
        return `${formattedAddress}\n(${value.careOf})`;
      }
      
      return formattedAddress || "-";
    }
    
    return value.toString();
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh",
        backgroundColor: "#f1f4f9" 
      }}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #ee3f65",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }}></div>
          <p style={{ color: "#2c3e50", fontSize: "16px" }}>Loading donor details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f1f4f9",
        padding: "20px",
        minHeight: "100vh",
      }}>
        <div style={{
          width: "90%",
          maxWidth: "500px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
          padding: "30px",
          textAlign: "center",
        }}>
          <h2 style={{ color: "#e74c3c", marginBottom: "20px" }}>Error</h2>
          <p style={{ color: "#2c3e50", marginBottom: "20px" }}>{error}</p>
          <button
            onClick={() => navigate(-1)}
            style={{
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
  }

  if (!sampleDetails) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f1f4f9",
        padding: "20px",
        minHeight: "100vh",
      }}>
        <div style={{
          width: "90%",
          maxWidth: "500px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
          padding: "30px",
          textAlign: "center",
        }}>
          <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>No Data Found</h2>
          <p style={{ color: "#7f8c8d", marginBottom: "20px" }}>Donor details not available.</p>
          <button
            onClick={() => navigate(-1)}
            style={{
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
  }

  // Separate documents and special fields
  const { documents, documenets, aadhaarData, issued, issuedToRequest, _id, __v, ...otherDetails } = sampleDetails;
  
  // Use documents if available, fallback to documenets (typo in API)
  const documentsList = documents || documenets || [];

  // Filter out unwanted fields and prepare the details for rendering
  const filteredDetails = Object.entries(otherDetails).filter(
    ([key, value]) => value !== null && value !== "" && value !== undefined
  );

  // Add special fields at the end
  if (issued !== undefined) {
    filteredDetails.push(["issued", issued]);
  }
  if (issuedToRequest !== undefined && issuedToRequest !== null) {
    filteredDetails.push(["issuedToRequest", issuedToRequest]);
  }

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "#f1f4f9",
        padding: "20px",
        minHeight: "100vh",
      }}>
        <div style={{
          width: "90%",
          maxWidth: "800px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
          padding: "30px",
        }}>
          <h1 style={{
            color: "#2c3e50",
            fontSize: "32px",
            fontWeight: "600",
            marginBottom: "30px",
            textAlign: "center",
            borderBottom: "3px solid #ee3f65",
            paddingBottom: "15px"
          }}>
            Donor Details
          </h1>

          {/* Display Aadhaar Data if available */}
          {aadhaarData && (
            <div style={{ marginBottom: "30px" }}>
              <h2 style={{
                color: "#ee3f65",
                fontSize: "24px",
                fontWeight: "600",
                marginBottom: "20px",
                borderBottom: "2px solid #f8f9fa",
                paddingBottom: "10px"
              }}>
                Aadhaar Information
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
                {Object.entries(aadhaarData)
                  .filter(([key, value]) => 
                    !["photo", "email", "phone", "document_pdf"].includes(key) && 
                    value !== null && 
                    value !== "" && 
                    value !== undefined
                  )
                  .map(([key, value]) => (
                    <div key={key} style={{
                      padding: "15px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      border: "1px solid #e9ecef"
                    }}>
                      <p style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#6c757d",
                        marginBottom: "5px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        {formatFieldName(key)}
                      </p>
                      <p style={{
                        fontSize: "16px",
                        color: "#2c3e50",
                        margin: 0,
                        fontWeight: "500",
                        whiteSpace: "pre-line"
                      }}>
                        {formatFieldValue(key, value)}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Display other details */}
          <div style={{ marginBottom: "30px" }}>
            <h2 style={{
              color: "#ee3f65",
              fontSize: "24px",
              fontWeight: "600",
              marginBottom: "20px",
              borderBottom: "2px solid #f8f9fa",
              paddingBottom: "10px"
            }}>
              General Information
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
              {filteredDetails.map(([key, value]) => (
                <div key={key} style={{
                  padding: "15px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  border: "1px solid #e9ecef"
                }}>
                  <p style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#6c757d",
                    marginBottom: "5px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    {formatFieldName(key)}
                  </p>
                  <p style={{
                    fontSize: "16px",
                    color: "#2c3e50",
                    margin: 0,
                    fontWeight: "500",
                    whiteSpace: "pre-line"
                  }}>
                    {formatFieldValue(key, value)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Display documents */}
          {documentsList && documentsList.length > 0 && (
            <div style={{ marginBottom: "30px" }}>
              <h2 style={{
                color: "#ee3f65",
                fontSize: "24px",
                fontWeight: "600",
                marginBottom: "20px",
                borderBottom: "2px solid #f8f9fa",
                paddingBottom: "10px"
              }}>
                Documents
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "15px"
              }}>
                {documentsList.map((doc, index) => {
                  const fileName = doc.split('/').pop();
                  return (
                    <a
                      key={index}
                      href={`http://localhost:4000/api/documents/${encodeURIComponent(fileName)}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "15px",
                        backgroundColor: "#f8f9fa",
                        color: "#2c3e50",
                        borderRadius: "8px",
                        textDecoration: "none",
                        border: "2px solid #e9ecef",
                        transition: "all 0.3s ease",
                        fontWeight: "500"
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseOver={(e) => {
                        e.target.style.borderColor = "#ee3f65";
                        e.target.style.backgroundColor = "#fff5f7";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.borderColor = "#e9ecef";
                        e.target.style.backgroundColor = "#f8f9fa";
                      }}
                    >
                      <span style={{ marginRight: "10px", fontSize: "18px" }}>📄</span>
                      {fileName}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div style={{ textAlign: "center", paddingTop: "20px", borderTop: "1px solid #e9ecef" }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: "12px 30px",
                backgroundColor: "#ee3f65",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
                fontWeight: "500",
                transition: "background-color 0.3s ease"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#d63656"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#ee3f65"}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewOocyteDonorDetails;