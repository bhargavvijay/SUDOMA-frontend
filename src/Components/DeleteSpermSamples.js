import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import AccessDenied from "./AccessDenied";

export default function DeleteSpermSamples() {

  let user=useSelector(selectUser);
  user=user.user;
  const accessToThisPage=user.permissions.spermSampleManagement.includes("delete sperm sample");

  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/view-sperm-samples",{
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch Sperm samples");
        }
        const data = await response.json();
        setSamples(data.data || []);
      } catch (error) {
        console.error("Error fetching samples:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSamples();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the sample? This action cannot be undone."
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:4000/api/delete-sperm-sample/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the sample");
      }

      alert("Sample deleted successfully!");

      // Update the UI by removing the deleted sample
      setSamples((prevSamples) => prevSamples.filter((sample) => sample._id !== id));
      setSelectedSample(null);
    } catch (error) {
      console.error("Error deleting sample:", error.message);
      alert("Failed to delete sample. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading samples...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const {issued, issuedToRequest, ...otherDetails}=selectedSample||{};
  const filteredDetails = Object.entries(otherDetails).filter(
    ([key,value]) =>value!=null && value!="" && !["_id", "__v"].includes(key)
  );

  if (issued !== undefined) {
    filteredDetails.push(["issued", issued ? "Yes" : "No"]);
  }
  if (issuedToRequest !== undefined) {
    filteredDetails.push(["issuedToRequest", issuedToRequest ?? "-"]);
  }


  return (
    accessToThisPage?
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
          Sperm Samples
        </h1>

        {!selectedSample ? (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {samples.length > 0 ? (
              samples.map((sample) => (
                <li
                  key={sample._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    marginBottom: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <div>
                    <p style={{ margin: "0", fontWeight: "bold" }}>{sample.donorName}</p>
                    <p style={{ margin: "0", color: "#555" }}>{sample.aadharNumber}</p>
                  </div>
                  <button
                    onClick={() => setSelectedSample(sample)}
                    style={{
                      backgroundColor: "#ee3f65",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 20px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    View Details
                  </button>
                </li>
              ))
            ) : (
              <p>No Sperm samples found.</p>
            )}
          </ul>
        ) : (
          <div>
            <h2
              style={{
                color: "#2c3e50",
                fontSize: "28px",
                fontWeight: "600",
                marginBottom: "25px",
              }}
            >
              Sample Details
            </h2>

            <div style={{ marginBottom: "20px", textAlign: "left" }}>
              {filteredDetails.map(([key, value]) => (
                <div key={key} style={{ marginBottom: "15px" }}>
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#ee3f65",
                      marginBottom: "8px",
                      textTransform: "capitalize",
                    }}
                  >
                    {key.replace(/([A-Z])/g, " $1")}
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
                    {key.toLowerCase().includes("date") ? new Date(value).toLocaleDateString() : value || "-"}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => setSelectedSample(null)}
                style={{
                  marginTop: "15px",
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
              <button
                onClick={() => handleDelete(selectedSample._id)}
                style={{
                  marginTop: "15px",
                  padding: "12px 25px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>:
    <AccessDenied/>
  );
}
