import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export const ViewSurrogateDetail = () => {
  const { id } = useParams(); // Extract the sample ID from the URL
  const [sampleDetails, setSampleDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSampleDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://sudoma-backend-api.onrender.com/api/view-surrogate-details/${id}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch surrogate details");
        const data = await response.json();
        console.log(data);

        setSampleDetails(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSampleDetails();
    }
  }, [id]);


  // Helper function to format field names
  const formatFieldName = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Helper function to format values
  const formatValue = (key, value) => {
    if (value === null || value === undefined || value === "") return "-";
    
    if (key === 'dateOfBirth') {
      return value;
    }
    if (key === 'photo') {
      return "Photo available";
    }
    if (key === 'documents' && Array.isArray(value)) {
      return `${value.length} document(s) uploaded`;
    }
    if (key === 'aadhaarData' && typeof value === 'object') {
      return "Aadhaar data verified";
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return value.toString();
  };

  // Group fields by category
  const getFieldsByCategory = (details) => {
    const personalInfo = ['donorName', 'age', 'gender', 'dateOfBirth', 'bloodGroup', 'height', 'weight', 'bmi', 'maritalStatus'];
    const medicalInfo = ['numberOfBabies', 'ageOfFirstBaby', 'abortion', 'numberOfAbortion'];
    const contactInfo = ['address', 'phone', 'email'];
    const verificationInfo = ['aadhaarVerified', 'source', 'maskedNumber'];
    const otherInfo = [];

    // Separate fields into categories
    Object.keys(details).forEach(key => {
      if (!personalInfo.includes(key) && !medicalInfo.includes(key) && 
          !contactInfo.includes(key) && !verificationInfo.includes(key) &&
          !['_id', '__v', 'aadhaarData', 'photo', 'documents', 'generatedAt', 'issued', 'issuedToRequest'].includes(key)) {
        otherInfo.push(key);
      }
    });

    return {
      'Personal Information': personalInfo.filter(key => details.hasOwnProperty(key)),
      'Medical Information': medicalInfo.filter(key => details.hasOwnProperty(key)),
      'Contact Information': contactInfo.filter(key => details.hasOwnProperty(key)),
      'Verification Information': verificationInfo.filter(key => details.hasOwnProperty(key)),
      'Additional Information': otherInfo
    };
  };

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "24px",
    paddingLeft: "120px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    lineHeight: "1.5"
  };

  const headerStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "32px",
    marginBottom: "24px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e5e7eb"
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "8px",
    letterSpacing: "-0.025em"
  };

  const subtitleStyle = {
    fontSize: "16px",
    color: "#6b7280",
    marginBottom: "0"
  };

  const sectionStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e5e7eb"
  };

  const sectionTitleStyle = {
    fontSize: "20px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "20px",
    paddingBottom: "12px",
    borderBottom: "2px solid #f3f4f6"
  };

  const fieldRowStyle = {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "16px",
    minHeight: "24px"
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#4b5563",
    width: "200px",
    flexShrink: 0,
    paddingTop: "2px"
  };

  const valueStyle = {
    fontSize: "16px",
    fontWeight: "400",
    color: "#111827",
    flex: 1,
    wordBreak: "break-word"
  };

  const loadingStyle = {
    ...containerStyle,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    color: "#6b7280"
  };

  const errorStyle = {
    ...containerStyle,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    color: "#dc2626"
  };

  const statusBadgeStyle = {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    backgroundColor: "#10b981",
    color: "white"
  };

  if (loading) {
    return <div style={loadingStyle}>Loading surrogate details...</div>;
  }

  if (error) {
    return <div style={errorStyle}>Error: {error}</div>;
  }

  if (!sampleDetails) {
    return <div style={errorStyle}>No surrogate details found for this ID.</div>;
  }

  console.log("Sample Details:", sampleDetails.documents);

  const fieldCategories = getFieldsByCategory(sampleDetails);

  return (
    <div style={containerStyle}>
      {/* Header Section */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Surrogate Profile</h1>
        {/* <p style={subtitleStyle}>
          Complete profile information for {sampleDetails.donorName || 'Surrogate'}
          {sampleDetails.aadhaarVerified && (
            <span style={{...statusBadgeStyle, marginLeft: "12px"}}>
              Aadhaar Verified
            </span>
          )}
        </p> */}
      </div>

      {/* Dynamic Sections */}
      {Object.entries(fieldCategories).map(([categoryName, fields]) => {
        if (fields.length === 0) return null;
        
        return (
          <div key={categoryName} style={sectionStyle}>
            <h2 style={sectionTitleStyle}>{categoryName}</h2>
            {fields.map((key) => (
              <div key={key} style={fieldRowStyle}>
                <label style={labelStyle}>{formatFieldName(key)}:</label>
                <span style={valueStyle}>{formatValue(key, sampleDetails[key])}</span>
              </div>
            ))}
          </div>
        );
      })}

      {/* Aadhaar Information */}
      {sampleDetails.aadhaarData && (
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Aadhaar Information</h2>
          <div style={fieldRowStyle}>
            <label style={labelStyle}>Full Name:</label>
            <span style={valueStyle}>{sampleDetails.aadhaarData.name}</span>
          </div>
          <div style={fieldRowStyle}>
            <label style={labelStyle}>Date of Birth:</label>
            <span style={valueStyle}>{sampleDetails.aadhaarData.dateOfBirth}</span>
          </div>
          <div style={fieldRowStyle}>
            <label style={labelStyle}>Gender:</label>
            <span style={valueStyle}>{sampleDetails.aadhaarData.gender}</span>
          </div>
          <div style={fieldRowStyle}>
            <label style={labelStyle}>Care Of:</label>
            <span style={valueStyle}>{sampleDetails.aadhaarData.address.careOf}</span>
          </div>
          <div style={fieldRowStyle}>
            <label style={labelStyle}>Address:</label>
            <span style={valueStyle}>
              {`${sampleDetails.aadhaarData.address.house || ''} ${sampleDetails.aadhaarData.address.street || ''}, ${sampleDetails.aadhaarData.address.locality || ''}, ${sampleDetails.aadhaarData.address.landmark || ''}, ${sampleDetails.aadhaarData.address.district || ''}, ${sampleDetails.aadhaarData.address.state || ''} - ${sampleDetails.aadhaarData.address.pin || ''}`}
            </span>
          </div>
          <div style={fieldRowStyle}>
            <label style={labelStyle}>Masked Number:</label>
            <span style={valueStyle}>{sampleDetails.aadhaarData.maskedNumber}</span>
          </div>
        </div>
      )}

      {/* Documents Section */}
      {sampleDetails.documents && sampleDetails.documents.length > 0 && (
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Documents</h2>
          {sampleDetails.documents.map((doc, index) => (
          
  <div key={index} style={fieldRowStyle}>
    <label style={labelStyle}>Document {index + 1}:</label>
    <span style={valueStyle}>
      <a
        href={`https://sudoma-backend-api.onrender.com/api/documents/${encodeURIComponent(doc.filename)}`}
        style={{
          display: "inline-block",
          padding: "8px 15px",
          backgroundColor: "#f0f0f0",
          color: "#2c3e50",
          borderRadius: "5px",
          textDecoration: "none",
          margin: "5px 0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          border: "1px solid #ddd"
        }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {doc.originalName || doc.filename}
      </a>
    </span>
  </div>
))}

        </div>
      )}
    </div>
  );
};

export default ViewSurrogateDetail;