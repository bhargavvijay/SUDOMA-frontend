import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import AccessDenied from "./AccessDenied";

export const ViewRecruitedOocyteDonors = () => {
  let user=useSelector(selectUser);
  user=user.user;
  const accessToThisPage=user.permissions.oocyteDonorManagement.includes("view recruited oocyte donors");

  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the received surrogates
  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/view-recruited-oocyte-samples"
        ,{
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch donors");
        }

        const data = await response.json();
        setSamples(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSamples();
  }, []);

  if (loading) {
    return <p>Loading donors...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    accessToThisPage ? 
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        fontFamily: "'Arial', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <h1
          style={{
            backgroundColor: "#ee3f65",
            color: "white",
            textAlign: "center",
            padding: "20px",
            fontSize: "26px",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Recruited Oocyte Donors
        </h1>
        <div style={{ padding: "20px" }}>
          {samples.length > 0 ? (
            <div
              style={{
                maxHeight: "500px", // Adjust height as needed
                overflowY: "auto", // Makes the table scrollable
                border: "1px solid #ddd",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "center",
                  fontSize: "16px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#ee3f65", color: "white" }}>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      Donor Name
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      aadhaarNumber
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {samples.map((sample, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f1f1f1")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          index % 2 === 0 ? "#f9f9f9" : "#ffffff")
                      }
                    >
                      <td
                        style={{ padding: "10px", border: "1px solid #ddd" }}
                      >
                        {sample.donorName}
                      </td>
                      <td
                        style={{ padding: "10px", border: "1px solid #ddd" }}
                      >
                        {sample.aadharNumber}
                      </td>
                      <td
                        style={{ padding: "10px", border: "1px solid #ddd" }}
                      >
                        <Link
                          to={`/view-oocyte-donor-details/${sample._id}`}
                          style={{
                            textDecoration: "none",
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px",
                          }}
                          title="View Details"
                        >
                          👁️
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p
              style={{
                textAlign: "center",
                fontSize: "18px",
                color: "#6c757d",
              }}
            >
              No donors found.
            </p>
          )}
        </div>
      </div>
    </div>:<AccessDenied/>
  );
};

export default ViewRecruitedOocyteDonors;
