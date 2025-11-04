import React, { useEffect, useState } from "react";
import AccessDenied from "./AccessDenied";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";

export const ViewOocyteRequisitions = (props) => {
  let user = useSelector(selectUser);
  user = user.user;
  let accessToThisPage = user.permissions.requisitionManagement.includes("view oocyte requisitions");

  const findMatches = props.findMatches || false;
  
  if (findMatches) {
    accessToThisPage = user.permissions.oocyteSampleManagement?.includes("issue oocyte sample");
  }

  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMatchesPage, setShowMatchesPage] = useState(false);
  const [data, setData] = useState(null);
  const [matchesFor, setMatchesFor] = useState(null);

  // Fetch the oocyte requisitions
  useEffect(() => {
    const fetchRequisitions = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/view-oocyte-requisitions",{
          credentials: "include",

        });

        if (!response.ok) {
          throw new Error("Failed to fetch requisitions");
        }

        const data = await response.json();
        setRequisitions(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequisitions();
  }, []);

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
      const response = await fetch(`http://localhost:4000/api/delete-oocyte-requisition/${id}`, {
        method: "DELETE",
        credentials: "include",

      });

      if (!response.ok) {
        throw new Error("Failed to delete the requisition");
      }

      // Filter out the deleted requisition from the state
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
      setMatchesFor(req._id);
      const requestBody = {
        bloodGroup: req.bloodGroup,
        height: req.height,
        weight: req.weight,
        eyeColor: req.eyeColor,
        hairColor: req.hairColor,
        skinColor: req.skinColor,
        artBank: req.artBank,
      };

      const response = await fetch("http://localhost:4000/api/find-matches-oocyte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),          credentials: "include",

        
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

  // Filter requisitions only if findMatches is true
  const filteredRequisitions = findMatches
    ? requisitions.filter((req) => !req.received) // Only include non-received requisitions
    : requisitions; // Use all requisitions otherwise

  return (
    accessToThisPage ? (
      <>
        {showMatchesPage ? (
          <div>
            {/* Uncomment and replace with your actual MatchingOocyteSamples component when available */}
            {/* <MatchingOocyteSamples
              setShowMatchesPage={setShowMatchesPage}
              data={data?.data}
              reqId={matchesFor}
            /> */}
            <div style={{ padding: "20px", textAlign: "center" }}>
              <h2>Matching Oocyte Samples</h2>
              <p>This feature is coming soon.</p>
              <button
                onClick={() => setShowMatchesPage(false)}
                style={{
                  backgroundColor: "#ee3f65",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 15px",
                  cursor: "pointer",
                  margin: "10px"
                }}
              >
                Back to Requisitions
              </button>
            </div>
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
                Raised Oocyte Requisitions
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
                        {!findMatches && (
                          <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Action</th>
                        )}
                        {findMatches && (
                          <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Action</th>
                        )}
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
                          {!findMatches ? (
                            <td
                              style={{
                                borderBottom: "1px solid #ddd",
                                padding: "10px",
                                textAlign: "center",
                              }}
                            >
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
                            </td>
                          ) : (
                            <td
                              style={{
                                borderBottom: "1px solid #ddd",
                                padding: "10px",
                                textAlign: "center",
                              }}
                            >
                              <button
                                onClick={() => handleFindMatches(req)}
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#dc3545",
                                  fontSize: "16px",
                                }}
                              >
                                Find Samples
                              </button>
                            </td>
                          )}
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
      </>
    ) : (
      <AccessDenied />
    )
  );
};

export default ViewOocyteRequisitions;