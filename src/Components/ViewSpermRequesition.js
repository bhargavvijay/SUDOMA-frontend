import React, { useEffect, useState } from "react";
import MatchingSpermSamples from "./MatchingSpermSamples";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import AccessDenied from "./AccessDenied";

export const ViewSpermRequisitions = (props) => {
  let user = useSelector(selectUser);
  user = user.user;
  let accessToThisPage = user.permissions.requisitionManagement.includes("view sperm requisitions");

  const findMatches = props.findMatches || false;
  
  if (findMatches) {                              
    accessToThisPage = user.permissions.spermSampleManagement.includes("issue sperm sample");
  }
  
  const [data, setData] = useState(null);
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMatchesPage, setShowMatchesPage] = useState(false);
  const [matchesFor, setMatchesFor] = useState(null);
  const [weightVariance,setWeightVariance] = useState(5);
  const [heightVariance,setHeightVariance] = useState(5);
  const [selectedRequisition,setSelectedRequisition] = useState(null);


  // Fetch the sperm requisitions
  useEffect(() => {
    const fetchRequisitions = async () => {
      try {
        const response = await fetch("https://sudoma-backend-api.onrender.com/api/view-sperm-requisition", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch requisitions");
        }

        const data = await response.json();
        console.log(data);
        setRequisitions(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequisitions();
  }, []);

  // Calculate pending time for each requisition
  const calculatePendingTime = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days===0?"":days+"d"} ${hours===0?"":hours+"h"} ${minutes}m`;
  };

  if (loading) {
    return <p>Loading requisitions...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this requisition? This action cannot be undone."
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await fetch(`https://sudoma-backend-api.onrender.com/api/delete-sperm-details/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the requisition");
      }

      setRequisitions((prevRequisitions) =>
        prevRequisitions.filter((req) => req._id !== id)
      );
      alert("Requisition deleted successfully!");
    } catch (error) {
      console.error("Error deleting requisition:", error.message);
      alert("Failed to delete requisition. Please try again.");
    }
  };

  const handleFindMatches = async (req) => {
    try {
      setSelectedRequisition(req);
      setMatchesFor(req._id);
      const requestBody = {
        bloodGroup: req.bloodGroup,
        height: req.height,
        weight: req.weight,
        artBank: req.artBank,
        heightVariance: heightVariance,
        weightVariance: weightVariance,
      };

      const response = await fetch("https://sudoma-backend-api.onrender.com/api/find-matches-sperm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "No match found.");
      }

      setData(await response.json());
      setShowMatchesPage(true);
    } catch (error) {
      console.error("Error finding matches:", error.message);
      alert(error.message);
    }
  };



  // Handle variance selection change


  // Filter requisitions only if findMatches is true
  const filteredRequisitions = findMatches
    ? requisitions.filter((req) => !req.received) // Only include non-received requisitions
    : requisitions; // Use all requisitions otherwise

  return (
    accessToThisPage ?
    <>
      {showMatchesPage ? (
        <div>
          <MatchingSpermSamples
            setShowMatchesPage={setShowMatchesPage}
            data={data?.data}
            reqId={matchesFor}
            selectedRequisition={selectedRequisition}
            heightVariance={heightVariance}
            setHeightVariance={setHeightVariance}
            setWeightVariance={setWeightVariance}
            weightVariance={weightVariance}
            handleFindMatches={handleFindMatches}
          />
        </div>
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
              maxWidth: "800px",
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
              Raised Sperm Requisitions
            </h1>
            
            <div style={{ padding: "20px" }}>
              {filteredRequisitions.length > 0 ? (
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
                      {findMatches && (
                        <th style={{ 
                          borderBottom: "2px solid #ddd", 
                          padding: "10px", 
                          backgroundColor: "#f8d7da", // Light red background for header
                          color: "#721c24", // Dark red text
                          fontWeight: "bold",
                        }}>
                          Pending From
                        </th>
                      )}
                      <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequisitions.map((req, index) => (
                      <tr key={index}>
                        <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                          {req.bloodGroup}
                        </td>
                        <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                          {req.height} cm
                        </td>
                        <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                          {req.weight} kg
                        </td>
                        <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                          {req.eyeColor}
                        </td>
                        <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                          {req.hairColor}
                        </td>
                        <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                          {req.skinColor}
                        </td>
                        <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                          {req.artBank}
                        </td>
                        {findMatches && (
                          <td style={{ 
                            borderBottom: "1px solid #ddd", 
                            padding: "10px", 
                            textAlign: "center",
                            backgroundColor: "#f8d7da", // Light red background for cell  
                          }}>
                            {req.createdAt ? calculatePendingTime(req.createdAt) : "N/A"}
                          </td>
                        )}
                        <td
                          style={{
                            borderBottom: "1px solid #ddd",
                            padding: "10px",
                            textAlign: "center",
                          }}
                        >
                          {!findMatches ? (
                            <button
                              onClick={() => handleDelete(req._id)}
                              style={{
                                backgroundColor: "transparent",
                                border: "none",
                                cursor: "pointer",
                                color: "#dc3545",
                                fontSize: "16px",
                              }}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          ) : (
                            <button
                              onClick={() => handleFindMatches(req)}
                              style={{
                                backgroundColor: "#ee3f65",
                                border: "none",
                                borderRadius: "4px",
                                padding: "6px 12px",
                                cursor: "pointer",
                                color: "white",
                                fontSize: "14px",
                              }}
                            >
                              Find Samples
                            </button>
                          )}
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
    </> :
    <AccessDenied />
  );
};

export default ViewSpermRequisitions;