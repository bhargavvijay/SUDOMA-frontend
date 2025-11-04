// import React, { useState, useEffect } from 'react';

// export default function ViewSurrogateSamples() {
//   const [samples, setSamples] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchSamples = async () => {
//       try {
//         const response = await fetch('https://sudoma-backend-api.onrender.com/api/view-surrogate-samples');

//         if (!response.ok) {
//           throw new Error('Failed to fetch surrogates');
//         }

//         const data = await response.json();
//         setSamples(data.data || []);
//       } catch (error) {
//         console.error('Error fetching surrogates:', error.message);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSamples();
//   }, []);

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm(
//       'Are you sure you want to delete the surrogate? This action cannot be undone.'
//     );
//     if (!confirmDelete) {
//       return;
//     }
//     try {
//       const response = await fetch(`https://sudoma-backend-api.onrender.com/api/delete-recieved-surrogte/${id}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete surrogate');
//       }

//       alert('Surrogate deleted successfully!');

//       // Update the UI by removing the deleted sample
//       setSamples((prevSamples) => prevSamples.filter((sample) => sample._id !== id));
//     } catch (error) {
//       console.error('Error deleting surrogate:', error.message);
//       alert('Failed to delete surrogate. Please try again.');
//     }
//   };

//   if (loading) {
//     return <p>Loading surrogates...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
//     <div
//       style={{
//         minHeight: '100vh',
//         backgroundColor: '#f8f9fa',
//         padding: '20px',
//         fontFamily: 'Arial, sans-serif',
//       }}
//     >
//       <div
//         style={{
//           maxWidth: '1200px',
//           margin: '0 auto',
//           backgroundColor: '#ffffff',
//           boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//           borderRadius: '12px',
//           overflow: 'hidden',
//         }}
//       >
//         <h1
//           style={{
//             backgroundColor: '#ee3f65',
//             color: 'white',
//             textAlign: 'center',
//             padding: '20px',
//             fontSize: '28px',
//             fontWeight: 'bold',
//           }}
//         >
//           Surrogates
//         </h1>
//         <div
//           style={{
//             padding: '0px',
//             overflowX: 'auto',
//             maxHeight: '600px',
//             overflowY: 'auto',
//           }}
//         >
//           {samples.length > 0 ? (
//             <table
//               style={{
//                 width: '100%',
//                 borderCollapse: 'collapse',
//                 textAlign: 'left',
//                 fontSize: '16px',
//               }}
//             >
//               <thead
//                 style={{
//                   position: 'sticky',
//                   top: 0,
//                   backgroundColor: '#ee3f65',
//                   color: '#fff',
//                 }}
//               >
//                 <tr>
//                   <th style={{ borderBottom: '2px solid #ddd', padding: '15px' }}>Surrogate Name</th>
//                   <th style={{ borderBottom: '2px solid #ddd', padding: '15px' }}>aadhaarNumber</th>
//                   <th style={{ borderBottom: '2px solid #ddd', padding: '15px' }}>Source</th>
//                   <th style={{ borderBottom: '2px solid #ddd', padding: '15px' }}>Blood Group</th>
//                   <th style={{ borderBottom: '2px solid #ddd', padding: '15px' }}>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {samples.map((sample) => (
//                   <tr key={sample._id}>
//                     <td style={{ borderBottom: '1px solid #ddd', padding: '15px' }}>{sample.donorName}</td>
//                     <td style={{ borderBottom: '1px solid #ddd', padding: '15px' }}>{sample.aadharNumber}</td>
//                     <td style={{ borderBottom: '1px solid #ddd', padding: '15px' }}>{sample.source}</td>
//                     <td style={{ borderBottom: '1px solid #ddd', padding: '15px' }}>{sample.bloodGroup}</td>
//                     <td style={{ borderBottom: '1px solid #ddd', padding: '15px', textAlign: 'center' }}>
//                       <button
//                         onClick={() => handleDelete(sample._id)}
//                         style={{
//                           backgroundColor: '#dc3545',
//                           color: '#fff',
//                           border: 'none',
//                           borderRadius: '5px',
//                           padding: '10px',
//                           cursor: 'pointer',
//                         }}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p>No surrogates available.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";import { selectUser } from "../features/auth/authSlice";import AccessDenied from "./AccessDenied";

export default function ViewSurrogateSamples() {
    let user=useSelector(selectUser);  user=user.user;  const accessToThisPage=user.permissions.surrogateManagement.includes("delete surrogate"
);
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const response = await fetch("https://sudoma-backend-api.onrender.com/api/view-surrogate-samples",{
          credentials: "include",

        });
        if (!response.ok) {
          throw new Error("Failed to fetch surrogates");
        }
        const data = await response.json();
        setSamples(data.data || []);
      } catch (error) {
        console.error("Error fetching surrogates:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSamples();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the surrogate? This action cannot be undone."
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await fetch(`https://sudoma-backend-api.onrender.com/api/delete-surrogate/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the surrogate");
      }

      alert("Surrogate deleted successfully!");

      // Update the UI by removing the deleted sample
      setSamples((prevSamples) => prevSamples.filter((sample) => sample._id !== id));
      setSelectedSample(null);
    } catch (error) {
      console.log(error.message);
      console.error("Error deleting surrogate:", error.message);
      alert("Failed to delete surrogate. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading surrogates...</p>;
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
    accessToThisPage ?
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
          Surrogates
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
              <p>No Surrogates available.</p>
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
              Surrogate Details
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
    <AccessDenied />
  );
}
