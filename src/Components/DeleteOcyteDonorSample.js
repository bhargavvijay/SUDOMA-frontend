// import React, { useEffect, useState } from "react";

// export default function ViewOocyteSamples() {
//   const [samples, setSamples] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchSamples = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/api/view-oocyte-samples");

//         if (!response.ok) {
//           throw new Error("Failed to fetch Oocyte donors");
//         }

//         const data = await response.json();
//         setSamples(data.data || []);
//       } catch (error) {
//         console.error("Error fetching donors:", error.message);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSamples();
//   }, []);

//   const handleDelete = async (id) => {
//     const confirmDelete=window.confirm(
//       "Are you sure you want to delete the donor? This action cannot be undone."
//     );
//     if(!confirmDelete){
//       return;
//     }
//     try {
//       const response = await fetch(`http://localhost:4000/api/delete-oocyte-sample/${id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete the donor");
//       }

//       alert("Donor deleted successfully!");

//       // Update the UI by removing the deleted sample
//       setSamples((prevSamples) => prevSamples.filter((sample) => sample._id !== id));
//     } catch (error) {
//       console.error("Error deleting donor:", error.message);
//       alert("Failed to delete donor. Please try again.");
//     }
//   };

//   if (loading) {
//     return <p>Loading donors...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         backgroundColor: "#f8f9fa",
//         padding: "20px",
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       <div
//         style={{
//           maxWidth: "1200px",
//           margin: "0 auto",
//           backgroundColor: "#ffffff",
//           boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//           borderRadius: "12px",
//           overflow: "hidden",
//         }}
//       >
//         <h1
//           style={{
//             backgroundColor: "#ee3f65",
//             color: "white",
//             textAlign: "center",
//             padding: "20px",
//             fontSize: "28px",
//             fontWeight: "bold",
//           }}
//         >
//           Oocyte Donor 
//         </h1>
//         <div
//           style={{
//             padding: "0px",
//             overflowX: "auto",
//             maxHeight: "600px",
//             overflowY: "auto",
//           }}
//         >
//           {samples.length > 0 ? (
//             <table
//               style={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 textAlign: "left",
//                 fontSize: "16px",
//               }}
//             >
//               <thead
//                 style={{
//                   position: "sticky",
//                   top: 0,
//                   backgroundColor: "#ee3f65",
//                   color: "#fff",
//                 }}
//               >
//                 <tr>
//                   {/* Table Headers */}
//                   <th style={{ borderBottom: "2px solid #ddd", padding: "15px" }}>Donor Name</th>
//                   <th style={{ borderBottom: "2px solid #ddd", padding: "15px" }}>aadhaarNumber</th>
//                   <th style={{ borderBottom: "2px solid #ddd", padding: "15px" }}>Collection Method</th>
//                   <th style={{ borderBottom: "2px solid #ddd", padding: "15px" }}>Collection Place</th>
//                   <th style={{ borderBottom: "2px solid #ddd", padding: "15px" }}>Sample Quantity</th>
//                   <th style={{ borderBottom: "2px solid #ddd", padding: "15px" }}>Collection Date</th>
//                   <th style={{ borderBottom: "2px solid #ddd", padding: "15px" }}>Storage Place</th>
//                   <th style={{ borderBottom: "2px solid #ddd", padding: "15px" }}>Expiry Date</th>
//                   <th style={{ borderBottom: "2px solid #ddd", padding: "15px" }}>Source</th>
//                   <th style={{ borderBottom: "2px solid #ddd", padding: "15px" }}>Blood Group</th>
//                   <th style={{ borderBottom: "2px solid #ddd", padding: "15px" }}>Height</th>
//                   <th style={{ borderBottom: "2px solid #ddd", padding: "15px" }}>Weight</th>
//                   <th style={{ borderBottom: "2px solid #ddd", padding: "15px" }}>BMI</th>
//                   <th style={{ borderBottom: "2px solid #ddd", padding: "15px" }}>Eye Color</th>
//                   <th style={{ borderBottom: "2px solid #ddd", padding: "15px" }}>Skin Color</th>
//                   <th style={{ borderBottom: "2px solid #ddd", padding: "15px" }}>Hair Color</th>
//                   <th style={{ borderBottom: "2px solid #ddd", padding: "15px" }}>Issued</th>
//                   <th style={{ borderBottom: "2px solid #ddd", padding: "15px" }}>Issued To Request</th>
//                   <th style={{ borderBottom: "2px solid #ddd", padding: "15px" }}>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {samples.map((sample) => (
//                   <tr key={sample._id}>
//                     {/* Table Data */}
//                     <td style={{ borderBottom: "1px solid #ddd", padding: "15px" }}>{sample.donorName}</td>
//                     <td style={{ borderBottom: "1px solid #ddd", padding: "15px" }}>{sample.aadharNumber}</td>
//                     <td style={{ borderBottom: "1px solid #ddd", padding: "15px" }}>{sample.collectionMethod}</td>
//                     <td style={{ borderBottom: "1px solid #ddd", padding: "15px" }}>{sample.collectionPlace}</td>
//                     <td style={{ borderBottom: "1px solid #ddd", padding: "15px" }}>{sample.sampleQuantity}</td>
//                     <td style={{ borderBottom: "1px solid #ddd", padding: "15px" }}>{new Date(sample.collectionDate).toLocaleDateString()}</td>
//                     <td style={{ borderBottom: "1px solid #ddd", padding: "15px" }}>{sample.storagePlace}</td>
//                     <td style={{ borderBottom: "1px solid #ddd", padding: "15px" }}>{new Date(sample.expiryDate).toLocaleDateString()}</td>
//                     <td style={{ borderBottom: "1px solid #ddd", padding: "15px" }}>{sample.source}</td>
//                     <td style={{ borderBottom: "1px solid #ddd", padding: "15px" }}>{sample.bloodGroup}</td>
//                     <td style={{ borderBottom: "1px solid #ddd", padding: "15px" }}>{sample.height} cm</td>
//                     <td style={{ borderBottom: "1px solid #ddd", padding: "15px" }}>{sample.weight} kg</td>
//                     <td style={{ borderBottom: "1px solid #ddd", padding: "15px" }}>{sample.bmi.toFixed(2)}</td>
//                     <td style={{ borderBottom: "1px solid #ddd", padding: "15px" }}>{sample.eyeColor}</td>
//                     <td style={{ borderBottom: "1px solid #ddd", padding: "15px" }}>{sample.skinColor}</td>
//                     <td style={{ borderBottom: "1px solid #ddd", padding: "15px" }}>{sample.hairColor}</td>
//                     <td style={{ borderBottom: "1px solid #ddd", padding: "15px" }}>{sample.issued ? "Yes" : "No"}</td>
//                     <td style={{ borderBottom: "1px solid #ddd", padding: "15px" }}>{sample.issuedToRequest || "N/A"}</td>
//                     <td style={{ borderBottom: "1px solid #ddd", padding: "15px", textAlign: "center" }}>
//                       <button
//                         onClick={() => handleDelete(sample._id)}
//                         style={{
//                           backgroundColor: "#dc3545",
//                           color: "#fff",
//                           border: "none",
//                           borderRadius: "5px",
//                           padding: "10px",
//                           cursor: "pointer",
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
//             <p>No Oocyte donors found.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from '../features/auth/authSlice';
import AccessDenied from "./AccessDenied";
export default function ViewOocyteSamples() {
  let user=useSelector(selectUser)  
  user=user.user
  const accessToThisPage=user.permissions.oocyteDonorManagement.includes("delete oocyte donor");


  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/view-oocyte-samples", {
          credentials: "include",
        }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Oocyte donors");
        }
        const data = await response.json();
        setSamples(data.data || []);
      } catch (error) {
        console.error("Error fetching donors:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSamples();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the donor? This action cannot be undone."
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:4000/api/delete-oocyte-sample/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the donor");
      }

      alert("Donor deleted successfully!");

      // Update the UI by removing the deleted sample
      setSamples((prevSamples) => prevSamples.filter((sample) => sample._id !== id));
      setSelectedSample(null);
    } catch (error) {
      console.error("Error deleting donor:", error.message);
      alert("Failed to delete donor. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading donors...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const {issued, issuedToRequest, ...otherDetails}=selectedSample||{};
  const filteredDetails = Object.entries(otherDetails).filter(
    ([key,value]) => value!=null && value!="" && !["_id", "__v"].includes(key)
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
          Oocyte Donors
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
              <p>No Oocyte Donors found.</p>
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
              Donor Details
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
    </div>:<AccessDenied/>
  );
}
