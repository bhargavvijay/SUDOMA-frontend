import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AccessDenied from "./AccessDenied";
import { selectUser } from "../features/auth/authSlice";

export const ViewSurrogateRequisition = () => {
  let user=useSelector(selectUser);
  user=user.user;
  const accessToThisPage=user.permissions.requisitionManagement.includes("view surrogate requisitions");   
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the surrogate requisitions
  useEffect(() => {
    const fetchRequisitions = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/view-surrogacy-requistion",{
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
    const confirmDelete=window.confirm(
      "Are you sure you want to delete this requisition? This action cannot be undone."
    );
    if(!confirmDelete){
      return;
    }
    try {
      const response = await fetch(`http://localhost:4000/api/delete-surrogacy-details/${id}`, {
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

  return (
    accessToThisPage?
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
          Raised Surrogate Requisitions
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
                  <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>BMI</th>
                  <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>ART Bank</th>
                  <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {requisitions.map((req, index) => (
                  <tr key={index}>
                    <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>{req.bloodGroup}</td>
                    <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>{req.height} cm</td>
                    <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>{req.weight} kg</td>
                    <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>{req.bmi.toFixed(2)}</td>
                    <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>{req.artBank}</td>
                    <td style={{ borderBottom: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
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
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No requisitions found.</p>
          )}
        </div>
      </div>
    </div>:
    <AccessDenied/>
  );
};

export default ViewSurrogateRequisition;
