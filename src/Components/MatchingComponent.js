import React, { useState } from "react";

const MatchingSpermSamples = ({ setShowMatchesPage, data, reqId }) => {
  const [issuedSampleId, setIssuedSampleId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleIssue = async (sampleId) => {
    const confirmIssue = window.confirm(
      "Are you sure you want to issue this sample? This action cannot be undone."
    );
    if (!confirmIssue) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://sudoma-backend-api.onrender.com/api/issue-sperm-sample",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sampleId,
            requisitionId: reqId,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to issue sample");
      }

      setIssuedSampleId(sampleId);
      alert("Sample issued successfully!");
      setShowMatchesPage(false); // Return to the requisitions page
    } catch (error) {
      console.error("Error issuing sample:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if data exists and has the expected structure
  if (!data) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>No matching samples found</h2>
        <button
          onClick={() => setShowMatchesPage(false)}
          style={{
            backgroundColor: "#ee3f65",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  // Extract the two categories of samples
  const fromRequestedSource = data.formRequestedSource || [];
  const fromDifferentSources = data.fromDiffrentSource || [];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <h1
          style={{
            backgroundColor: "#ee3f65",
            color: "white",
            textAlign: "center",
            padding: "20px",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "0",
          }}
        >
          Matching Sperm Samples
        </h1>

        <div style={{ padding: "20px" }}>
          <div style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={() => setShowMatchesPage(false)}
              style={{
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Back to Requisitions
            </button>
          </div>

          {/* Samples from the Requested Bank */}
          <h2 style={{ borderBottom: "2px solid #ee3f65", paddingBottom: "8px", marginBottom: "15px" }}>
            Samples from Requested Bank
          </h2>
          {fromRequestedSource.length > 0 ? (
            <div style={{ marginBottom: "30px" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  marginBottom: "20px",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>ID</th>
                    <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Blood Group</th>
                    <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Height</th>
                    <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Weight</th>
                    <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Source</th>
                    <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fromRequestedSource.map((sample) => (
                    <tr key={sample._id}>
                      <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                        {sample._id}
                      </td>
                      <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                        {sample.bloodGroup}
                      </td>
                      <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                        {sample.height} cm
                      </td>
                      <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                        {sample.weight} kg
                      </td>
                      <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                        {sample.source}
                      </td>
                      <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                        <button
                          onClick={() => handleIssue(sample._id)}
                          disabled={loading || issuedSampleId === sample._id}
                          style={{
                            backgroundColor: issuedSampleId === sample._id ? "#28a745" : "#ee3f65",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            cursor: issuedSampleId === sample._id ? "default" : "pointer",
                            opacity: loading ? 0.7 : 1,
                          }}
                        >
                          {issuedSampleId === sample._id
                            ? "Issued"
                            : loading
                            ? "Processing..."
                            : "Issue Sample"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: "#6c757d", fontStyle: "italic" }}>No samples found from the requested bank.</p>
          )}

          {/* Samples from Different Banks */}
          <h2 style={{ borderBottom: "2px solid #ee3f65", paddingBottom: "8px", marginBottom: "15px" }}>
            Samples from Other Banks
          </h2>
          {fromDifferentSources.length > 0 ? (
            <div>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>ID</th>
                    <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Blood Group</th>
                    <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Height</th>
                    <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Weight</th>
                    <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Source</th>
                    <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fromDifferentSources.map((sample) => (
                    <tr key={sample._id}>
                      <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                        {sample._id}
                      </td>
                      <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                        {sample.bloodGroup}
                      </td>
                      <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                        {sample.height} cm
                      </td>
                      <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                        {sample.weight} kg
                      </td>
                      <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                        {sample.source}
                      </td>
                      <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                        <button
                          onClick={() => handleIssue(sample._id)}
                          disabled={loading || issuedSampleId === sample._id}
                          style={{
                            backgroundColor: issuedSampleId === sample._id ? "#28a745" : "#ee3f65",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            cursor: issuedSampleId === sample._id ? "default" : "pointer",
                            opacity: loading ? 0.7 : 1,
                          }}
                        >
                          {issuedSampleId === sample._id
                            ? "Issued"
                            : loading
                            ? "Processing..."
                            : "Issue Sample"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: "#6c757d", fontStyle: "italic" }}>No samples found from other banks.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchingSpermSamples;