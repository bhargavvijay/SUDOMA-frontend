import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import AccessDenied from "./AccessDenied";

export default function IssueSurrogateSample() {
  let user = useSelector(selectUser);
  user = user.user;
  const accessToThisPage = user.permissions.surrogateManagement.includes("allocate surrogate");
  
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [samples, setSamples] = useState(null);
  const [currentReq, setCurrentReq] = useState(null);
  const [showSamples, setShowSamples] = useState(false);
  const [heightVariance, setHeightVariance] = useState(5);
  const [weightVariance, setWeightVariance] = useState(5);
  const [filteredSamples, setFilteredSamples] = useState({ requestedArtBank: [], otherArtBanks: [] });

  // Color scheme
  const colors = {
    primary: '#EA4D6D',    // Vibrant pink
    secondary: '#B58AA7',  // Soft purple/mauve
    neutral: '#A6A6A6',    // Gray
    light: '#f8f9fa',
    white: '#ffffff',
    success: '#4CAF50',
    text: '#333333',
    border: '#dddddd'
  };

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: colors.light,
      padding: '20px',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    card: {
      maxWidth: '1000px',
      margin: '0 auto',
      backgroundColor: colors.white,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      overflow: 'hidden',
    },
    header: {
      backgroundColor: colors.primary,
      color: colors.white,
      textAlign: 'center',
      padding: '24px',
      fontSize: '24px',
      fontWeight: 'bold',
    },
    content: {
      padding: '24px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left',
      marginBottom: '30px',
    },
    tableHeader: {
      backgroundColor: colors.secondary,
      color: colors.white,
      padding: '12px 15px',
      fontSize: '14px',
      fontWeight: 'bold',
      borderBottom: `2px solid ${colors.border}`,
    },
    tableCell: {
      padding: '12px 15px',
      borderBottom: `1px solid ${colors.border}`,
      fontSize: '14px',
    },
    primaryButton: {
      backgroundColor: colors.primary,
      color: colors.white,
      border: 'none',
      padding: '8px 14px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s',
    },
    successButton: {
      backgroundColor: colors.primary,
      color: colors.white,
      border: 'none',
      padding: '8px 14px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s',
    },
    disabledButton: {
      backgroundColor: colors.neutral,
      color: colors.white,
      border: 'none',
      padding: '8px 14px',
      borderRadius: '5px',
      cursor: 'not-allowed',
      fontSize: '14px',
      fontWeight: '500',
    },
    sectionTitle: {
      color: colors.secondary,
      fontSize: '20px',
      fontWeight: 'bold',
      margin: '24px 0 16px 0',
      paddingBottom: '8px',
      borderBottom: `2px solid ${colors.secondary}`,
    },
    backButton: {
      backgroundColor: colors.secondary,
      color: colors.white,
      border: 'none',
      padding: '8px 14px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '20px',
    },
    noData: {
      color: colors.neutral,
      fontStyle: 'italic',
      margin: '20px 0',
    },
    filterContainer: {
      backgroundColor: colors.light,
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: `1px solid ${colors.border}`,
    },
    filterTitle: {
      color: colors.secondary,
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '12px',
    },
    filterRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
      gap: '10px',
    },
    filterLabel: {
      fontSize: '14px',
      color: colors.text,
      minWidth: '120px',
    },
    filterInput: {
      padding: '8px',
      borderRadius: '4px',
      border: `1px solid ${colors.border}`,
      width: '80px',
    },
    applyButton: {
      backgroundColor: colors.secondary,
      color: colors.white,
      border: 'none',
      padding: '8px 14px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px',
      marginLeft: '10px',
    },
    debugInfo: {
      backgroundColor: '#f8f9fa',
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '10px',
      marginBottom: '15px',
      fontSize: '14px',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      display: 'none', // Set to 'block' for debugging
    },
    highlightRow: {
      backgroundColor: 'rgba(234, 77, 109, 0.1)',
    }
  };

  // Fetch surrogate requisitions
  useEffect(() => {
    const fetchSurrogateRequisitions = async () => {
      try {
        const response = await fetch('https://sudoma-backend-api.onrender.com/api/get-surrogate-requisitions',{
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error('Failed to fetch surrogate requisitions');
        }
        let data = await response.json();
        data = data.data; // Assuming the API returns a `data` object
        console.log("Requisitions data:", data);

        // If there's no data from the API, use some sample data for testing
        if (!data || data.length === 0) {
          console.log("No requisitions returned, using sample data for testing");
          data = [
            {
              _id: "507f1f77bcf86cd799439011", // Valid 24-character ObjectId
              bloodGroup: "B-",
              height: 120,
              weight: 40,
              bmi: 27.78,
              artBank: "Kushal R123",
              received: false
            },
            {
              _id: "507f1f77bcf86cd799439012", // Valid 24-character ObjectId
              bloodGroup: "A+",
              height: 165,
              weight: 65,
              bmi: 23.88,
              artBank: "Bhargav vijay",
              received: true
            }
          ];
        }

        setRequisitions(data);
      } catch (err) {
        console.error("Error fetching requisitions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSurrogateRequisitions();
  }, []);

  // Filter samples based on height and weight variance
  useEffect(() => {
    if (!samples) return;
    
    console.log("Current samples:", samples);
    console.log("Current req:", currentReq);
    console.log("Height variance:", heightVariance);
    console.log("Weight variance:", weightVariance);
    
    const applyFilters = (sampleList) => {
      return sampleList.filter(sample => {
        // Debug individual sample
        console.log("Checking sample:", sample);
        
        // Filter by blood group match (handle different formats like "B-" and "B")
        const normalizeBloodGroup = (bg) => bg.replace(/-/g, '').toUpperCase().trim();
        const bloodGroupMatch = normalizeBloodGroup(sample.bloodGroup) === normalizeBloodGroup(currentReq.bloodGroup);
        console.log("Blood group match:", bloodGroupMatch, sample.bloodGroup, currentReq.bloodGroup);
        
        // Filter by height variance (with safety checks)
        const sampleHeight = Number(sample.height) || 0;
        const reqHeight = Number(currentReq.height) || 0;
        const heightLower = reqHeight - heightVariance;
        const heightUpper = reqHeight + heightVariance;
        const heightMatch = sampleHeight >= heightLower && sampleHeight <= heightUpper;
        console.log("Height match:", heightMatch, sampleHeight, `${heightLower}-${heightUpper}`);
        
        // Filter by weight variance (with safety checks)
        const sampleWeight = Number(sample.weight) || 0;
        const reqWeight = Number(currentReq.weight) || 0;
        const weightLower = reqWeight - weightVariance;
        const weightUpper = reqWeight + weightVariance;
        const weightMatch = sampleWeight >= weightLower && sampleWeight <= weightUpper;
        console.log("Weight match:", weightMatch, sampleWeight, `${weightLower}-${weightUpper}`);
        
        // Check if issued (with safety check)
        const notIssued = sample.issued !== true;
        console.log("Not issued:", notIssued);
        
        return bloodGroupMatch && heightMatch && weightMatch && notIssued;
      });
    };

    const filteredRequestedBank = applyFilters(samples.requestedArtBank);
    const filteredOtherBanks = applyFilters(samples.otherArtBanks);
    
    console.log("Filtered results:", {
      requestedArtBank: filteredRequestedBank.length,
      otherArtBanks: filteredOtherBanks.length
    });

    setFilteredSamples({
      requestedArtBank: filteredRequestedBank,
      otherArtBanks: filteredOtherBanks
    });
  }, [samples, heightVariance, weightVariance, currentReq]);

  const handleFindSamples = async (req) => {
    setCurrentReq(req);
    try {
      const response = await fetch('https://sudoma-backend-api.onrender.com/api/find-matches-surrogate', {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bloodGroup: req.bloodGroup, 
          artBank: req.artBank,
          height: req.height,
          weight: req.weight
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to find surrogate');
      }

      const matchData = await response.json();
      console.log("API response data:", matchData);
      
      // If no data returned, provide some test data for development/debugging
      let processedData;
      if (!matchData.data || (!matchData.data.sameBankMatches?.length && !matchData.data.otherBankMatches?.length)) {
        console.log("No results returned from API, using sample data for testing");
        // Sample test data with valid ObjectIds
        processedData = {
          requestedArtBank: [
          
          ],
          otherArtBanks: [
            
          ]
        };
      } else {
        // Use the actual API data
        processedData = {
          requestedArtBank: matchData.data.sameBankMatches || [],
          otherArtBanks: matchData.data.otherBankMatches || [],
        };
      }
      
      setSamples(processedData);
      setShowSamples(true);
    } catch (error) {
      console.error('Error finding surrogate:', error.message);
      alert(error.message);
    }
  };

  const handleIssueSample = async (sample) => {
    try {
      console.log("Issuing surrogate sample:", sample);
      const response = await fetch('https://sudoma-backend-api.onrender.com/api/issue-surrogate-sample', {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sampleId: sample._id, // Assuming the sample has a unique `_id` field
          reqId: currentReq._id, // Assuming `currentReq` contains the requisition details
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to issue surrogate.');
      }

      const result = await response.json();
      alert(`Surrogate issued successfully: ${result.message}`);

      // Update the sample's issued status
      setSamples((prevSamples) => {
        const updateIssuedStatus = (sampleList) => 
          sampleList.map(s => s._id === sample._id ? {...s, issued: true} : s);
        
        return {
          requestedArtBank: updateIssuedStatus(prevSamples.requestedArtBank),
          otherArtBanks: updateIssuedStatus(prevSamples.otherArtBanks),
        };
      });
      
      // This will trigger the useEffect to refilter the samples
    } catch (error) {
      console.error('Error issuing surrogate:', error.message);
      alert(error.message);
    }
  };

  const handleBackToRequisitions = () => {
    setShowSamples(false);
    setSamples(null);
    setCurrentReq(null);
  };

  const handleApplyFilters = () => {
    // The useEffect will handle filtering when height/weight variance changes
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>Surrogate Management</div>
          <div style={styles.content}>
            <p>Loading surrogate requisitions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>Surrogate Management</div>
          <div style={styles.content}>
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    accessToThisPage ? (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            {showSamples ? 'Available Surrogates' : 'Surrogate Requisitions'}
          </div>
          <div style={styles.content}>
            {showSamples && samples ? (
              <>
                <button
                  onClick={handleBackToRequisitions}
                  style={styles.backButton}
                >
                  ← Back to Requisitions
                </button>

                <div style={{marginBottom: '20px'}}>
                  <p><strong>Selected Requisition:</strong> {currentReq.bloodGroup} blood group for {currentReq.artBank}</p>
                  <p><strong>Requested Height:</strong> {currentReq.height} cm | <strong>Weight:</strong> {currentReq.weight} kg</p>
                </div>
                
                {/* Filter Controls */}
                <div style={styles.filterContainer}>
                  <h4 style={styles.filterTitle}>Filter by Variance</h4>
                  <div style={styles.filterRow}>
                    <label style={styles.filterLabel}>Height Variance (cm):</label>
                    <input 
                      type="number" 
                      value={heightVariance}
                      onChange={(e) => setHeightVariance(Number(e.target.value))}
                      min={0}
                      style={styles.filterInput}
                    />
                    <span style={{color: colors.text, fontSize: '14px'}}>
                      ({currentReq.height - heightVariance} - {currentReq.height + heightVariance} cm)
                    </span>
                  </div>
                  <div style={styles.filterRow}>
                    <label style={styles.filterLabel}>Weight Variance (kg):</label>
                    <input 
                      type="number" 
                      value={weightVariance}
                      onChange={(e) => setWeightVariance(Number(e.target.value))}
                      min={0}
                      style={styles.filterInput}
                    />
                    <span style={{color: colors.text, fontSize: '14px'}}>
                      ({currentReq.weight - weightVariance} - {currentReq.weight + weightVariance} kg)
                    </span>
                  </div>
                  <button 
                    onClick={handleApplyFilters}
                    style={styles.applyButton}
                  >
                    Apply Filters
                  </button>
                </div>
                
                {/* Debug Information - Set display to 'block' to show */}
                <div style={styles.debugInfo}>
                  <h4>Debug Information</h4>
                  <pre>
                    Current Req: {JSON.stringify(currentReq, null, 2)}
                    Available Samples: {samples ? JSON.stringify({
                      sameBankCount: samples.requestedArtBank.length,
                      otherBankCount: samples.otherArtBanks.length
                    }, null, 2) : 'None'}
                    Filtered Samples: {JSON.stringify({
                      sameBankCount: filteredSamples.requestedArtBank.length,
                      otherBankCount: filteredSamples.otherArtBanks.length
                    }, null, 2)}
                  </pre>
                </div>

                <h3 style={styles.sectionTitle}>Surrogates from Requested ART Bank</h3>
                {filteredSamples.requestedArtBank.length > 0 ? (
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.tableHeader}>Surrogate Name</th>
                        <th style={styles.tableHeader}>Aadhaar Number</th>
                        <th style={styles.tableHeader}>Source</th>
                        <th style={styles.tableHeader}>Blood Group</th>
                        <th style={styles.tableHeader}>Height (cm)</th>
                        <th style={styles.tableHeader}>Weight (kg)</th>
                        <th style={styles.tableHeader}>BMI</th>
                        <th style={styles.tableHeader}>Issued</th>
                        <th style={styles.tableHeader}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSamples.requestedArtBank.map((sample, index) => (
                        <tr key={index}>
                          <td style={styles.tableCell}>{sample.donorName}</td>
                          <td style={styles.tableCell}>{sample.aadharNumber}</td>
                          <td style={styles.tableCell}>{sample.source}</td>
                          <td style={styles.tableCell}>{sample.bloodGroup}</td>
                          <td style={styles.tableCell}>{sample.height}</td>
                          <td style={styles.tableCell}>{sample.weight}</td>
                          <td style={styles.tableCell}>
                            {sample.bmi ? sample.bmi.toFixed(2) : 'N/A'}
                          </td>
                          <td style={styles.tableCell}>
                            {sample.issued ? 'Yes' : 'No'}
                          </td>
                          <td style={styles.tableCell}>
                            {sample.issued ? (
                              <button
                                style={styles.disabledButton}
                                disabled
                              >
                                Issued
                              </button>
                            ) : (
                              <button
                                onClick={() => handleIssueSample(sample)}
                                style={styles.successButton}
                              >
                                Issue Surrogate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={styles.noData}>No matching surrogates found in the requested ART bank.</p>
                )}

                <h3 style={styles.sectionTitle}>Surrogates from Other ART Banks</h3>
                {filteredSamples.otherArtBanks.length > 0 ? (
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.tableHeader}>Surrogate Name</th>
                        <th style={styles.tableHeader}>Aadhaar Number</th>
                        <th style={styles.tableHeader}>Source</th>
                        <th style={styles.tableHeader}>Blood Group</th>
                        <th style={styles.tableHeader}>Height (cm)</th>
                        <th style={styles.tableHeader}>Weight (kg)</th>
                        <th style={styles.tableHeader}>BMI</th>
                        <th style={styles.tableHeader}>Issued</th>
                        <th style={styles.tableHeader}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSamples.otherArtBanks.map((sample, index) => (
                        <tr key={index}>
                          <td style={styles.tableCell}>{sample.donorName}</td>
                          <td style={styles.tableCell}>{sample.aadharNumber}</td>
                          <td style={styles.tableCell}>{sample.source}</td>
                          <td style={styles.tableCell}>{sample.bloodGroup}</td>
                          <td style={styles.tableCell}>{sample.height}</td>
                          <td style={styles.tableCell}>{sample.weight}</td>
                          <td style={styles.tableCell}>
                            {sample.bmi ? sample.bmi.toFixed(2) : 'N/A'}
                          </td>
                          <td style={styles.tableCell}>
                            {sample.issued ? 'Yes' : 'No'}
                          </td>
                          <td style={styles.tableCell}>
                            <button
                              onClick={() => handleIssueSample(sample)}
                              style={styles.successButton}
                              disabled={sample.issued}
                            >
                              {sample.issued ? 'Issued' : 'Issue Surrogate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={styles.noData}>No matching surrogates found in other ART banks.</p>
                )}
              </>
            ) : (
              <>
                <h2 style={{color: colors.secondary, marginBottom: '20px', fontSize: '18px'}}>
                  Available Surrogate Requisitions
                </h2>
                {requisitions.length > 0 ? (
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.tableHeader}>Blood Group</th>
                        <th style={styles.tableHeader}>Height (cm)</th>
                        <th style={styles.tableHeader}>Weight (kg)</th>
                        <th style={styles.tableHeader}>BMI</th>
                        <th style={styles.tableHeader}>ART Bank</th>
                        <th style={styles.tableHeader}>Received</th>
                        <th style={styles.tableHeader}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requisitions.map((req, index) => (
                        <tr key={index}>
                          <td style={styles.tableCell}>{req.bloodGroup}</td>
                          <td style={styles.tableCell}>{req.height}</td>
                          <td style={styles.tableCell}>{req.weight}</td>
                          <td style={styles.tableCell}>
                            {req.bmi ? req.bmi.toFixed(2) : 'N/A'}
                          </td>
                          <td style={styles.tableCell}>{req.artBank}</td>
                          <td style={styles.tableCell}>
                            {req.received ? 'Yes' : 'No'}
                          </td>
                          <td style={styles.tableCell}>
                            <button
                              onClick={() => handleFindSamples(req)}
                              style={styles.primaryButton}
                            >
                              Find Surrogates
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={styles.noData}>No requisitions found.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    ) : (
      <AccessDenied />
    )
  );
}