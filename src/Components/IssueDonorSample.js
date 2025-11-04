import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import AccessDenied from './AccessDenied';
import VarianceFillter from './VarianceFillter';

export default function IssueDonorSample() {
  const user = useSelector(selectUser).user;
  const accessToThisPage = user.permissions.oocyteDonorManagement.includes("allocate oocyte donor");

  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [samples, setSamples] = useState(null);
  const [currentReq, setCurrentReq] = useState(null);
  const [showSamples, setShowSamples] = useState(false);
  const [variancePercentage, setVariancePercentage] = useState(5);
  const [issuedSampleId, setIssuedSampleId] = useState(null);
  const [issueLoading, setIssueLoading] = useState(false);
  const [heightVariance, setHeightVariance] = useState(5);
  const [weightVariance, setWeightVariance] = useState(5);

  // Fetch requisitions
  useEffect(() => {
    const fetchOocyteRequisitions = async () => {
      try {
        const response = await fetch('https://sudoma-backend-api.onrender.com/api/view-oocyte-requisitions', {
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch oocyte requisitions');
        }
        
        let data = await response.json();
        data = data.data;
        data = data.filter(obj => !obj.received);
        
        setRequisitions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOocyteRequisitions();
  }, []);

  const handleFindSamples = async (req) => {
    setCurrentReq(req);
    console.log("CALLED")
    try {
      const response = await fetch('https://sudoma-backend-api.onrender.com/api/find-matches-oocyte', {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bloodGroup: req.bloodGroup,
          artBank: req.artBank,
          height: req.height,
          weight: req.weight,
          heightVariance: heightVariance,
          weightVariance: weightVariance,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to find matches');
      }

      const matchData = await response.json();
      setSamples({
        requestedArtBank: matchData.data.sameBankMatches || [],
        otherArtBanks: matchData.data.otherBankMatches || [],
      });
      setShowSamples(true);
    } catch (error) {
      console.error('Error finding matches:', error.message);
      alert(error.message);
    }
  };

  const handleIssueSample = async (sample) => {
    const confirmIssue = window.confirm(
      "Are you sure you want to issue this donor? This action cannot be undone."
    );
    
    if (!confirmIssue) {
      return;
    }
    
    setIssueLoading(true);
    setIssuedSampleId(sample._id);
    
    try {
      const response = await fetch("https://sudoma-backend-api.onrender.com/api/issue-oocyte-sample", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sampleId: sample._id,
          reqId: currentReq._id,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to issue donor.");
      }
  
      const result = await response.json();
      alert(`Donor issued successfully: ${result.message}`);
      window.location.reload();
      setShowSamples(false);
    } catch (error) {
      console.error("Error issuing donor:", error.message);
      alert(error.message);
      setIssuedSampleId(null);
    } finally {
      setIssueLoading(false);
    }
  };
  
  if (loading) {
    return <p>Loading requisitions...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Function to display how long a requisition has been pending
  const pendingFrom = (req) => {
    if (!req.createdAt) return "N/A";
  
    const createdAt = new Date(req.createdAt);
    const now = new Date();
    
    const diffMs = now - createdAt;
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    
    // Style for the pending time display
    const styles = {
      container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "5px",
        borderRadius: "6px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6"
      },
      time: {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#495057",
        marginBottom: "3px"
      },
      label: {
        fontSize: "11px",
        color: "#6c757d",
        textTransform: "uppercase"
      }
    };
    
    // Format the time parts
    const timeDisplay = [];
    if (days > 0) timeDisplay.push(`${days}d`);
    if (hours > 0) timeDisplay.push(`${hours}hr`);
    timeDisplay.push(`${minutes}min`);

    return (
      <div style={styles.container}>
        <div style={styles.time}>{timeDisplay.join(" ")}</div>
        <div style={styles.label}>Waiting</div>
      </div>
    );
  };

  // MatchingDonorSamples component moved inside the main component to access state directly
  const MatchingDonorSamples = () => {
    if (!samples) {
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h2>No matching donors found</h2>
          <button
            onClick={() => setShowSamples(false)}
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

    const fromRequestedSource = samples.requestedArtBank || [];
    const fromDifferentSources = samples.otherArtBanks || [];

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
            Matching Oocyte Donors
          </h1>

          <VarianceFillter
            heightVariance={heightVariance}
            setHeightVariance={setHeightVariance}
            weightVariance={weightVariance}
            setWeightVariance={setWeightVariance}
            selectedRequisition={currentReq}
            handleFindMatches={handleFindSamples}
          />

          <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={() => setShowSamples(false)}
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
              <span style={{ fontStyle: "italic" }}>
                Showing donors with {variancePercentage}% variance in height and weight
              </span>
            </div>

            {/* Donors from the Requested Bank */}
            <h2 style={{ borderBottom: "2px solid #ee3f65", paddingBottom: "8px", marginBottom: "15px" }}>
              Donors from Requested Bank
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
                      <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Donor Name</th>
                      <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Blood Group</th>
                      <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Height</th>
                      <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Weight</th>
                      <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Storage Place</th>
                      <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fromRequestedSource.map((sample) => (
                      <tr key={sample._id}>
                        <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                          {sample.donorName}
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
                          {sample.storagePlace}
                        </td>
                        <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                          <button
                            onClick={() => handleIssueSample(sample)}
                            disabled={issueLoading || issuedSampleId === sample._id}
                            style={{
                              backgroundColor: issuedSampleId === sample._id ? "#28a745" : "#ee3f65",
                              color: "white",
                              border: "none",
                              padding: "5px 10px",
                              borderRadius: "5px",
                              cursor: issuedSampleId === sample._id ? "default" : "pointer",
                              opacity: issueLoading ? 0.7 : 1,
                            }}
                          >
                            {issuedSampleId === sample._id
                              ? "Issued"
                              : issueLoading
                              ? "Processing..."
                              : "Issue Donor"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: "#6c757d", fontStyle: "italic" }}>No donors found from the requested bank.</p>
            )}

            {/* Donors from Different Banks */}
            <h2 style={{ borderBottom: "2px solid #ee3f65", paddingBottom: "8px", marginBottom: "15px" }}>
              Donors from Other Banks
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
                      <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Donor Name</th>
                      <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Blood Group</th>
                      <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Height</th>
                      <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Weight</th>
                      <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Storage Place</th>
                      <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fromDifferentSources.map((sample) => (
                      <tr key={sample._id}>
                        <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                          {sample.donorName}
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
                          {sample.storagePlace}
                        </td>
                        <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                          <button
                            onClick={() => handleIssueSample(sample)}
                            disabled={issueLoading || issuedSampleId === sample._id}
                            style={{
                              backgroundColor: issuedSampleId === sample._id ? "#28a745" : "#ee3f65",
                              color: "white",
                              border: "none",
                              padding: "5px 10px",
                              borderRadius: "5px",
                              cursor: issuedSampleId === sample._id ? "default" : "pointer",
                              opacity: issueLoading ? 0.7 : 1,
                            }}
                          >
                            {issuedSampleId === sample._id
                              ? "Issued"
                              : issueLoading
                              ? "Processing..."
                              : "Issue Donor"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: "#6c757d", fontStyle: "italic" }}>No donors found from other banks.</p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    accessToThisPage ? (
      <div>
        {showSamples ? (
          <MatchingDonorSamples />
        ) : (
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
                }}
              >
                Oocyte Requisitions
              </h1>
              <div style={{ padding: "20px" }}>
                
                {requisitions.length > 0 ? (
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      textAlign: "left",
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Blood Group</th>
                        <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Height</th>
                        <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Weight</th>
                        <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Eye Color</th>
                        <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Hair Color</th>
                        <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Complexion</th>
                        <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>ART Bank</th>
                        <th style={{ borderBottom: "2px solid #ddd", padding: "10px", textAlign: "center" }}>Pending Status</th>
                        <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requisitions.map((req, index) => (
                        <tr key={index}>
                          <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>{req.bloodGroup}</td>
                          <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>{req.height} cm</td>
                          <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>{req.weight} kg</td>
                          <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>{req.eyeColor}</td>
                          <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>{req.hairColor}</td>
                          <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>{req.skinColor}</td>
                          <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>{req.artBank}</td>
                          <td style={{ borderBottom: "1px solid #ddd", padding: "10px", textAlign: "center" }}>{pendingFrom(req)}</td>
                          <td style={{ borderBottom: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                            <button
                              onClick={() => handleFindSamples(req)}
                              style={{
                                backgroundColor: "#ee3f65",
                                color: "#fff",
                                border: "none",
                                padding: "5px 10px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "14px",
                              }}
                            >
                              Find Donors
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No requisitions found.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    ) : (
      <AccessDenied />
    )
  );
}