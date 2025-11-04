// import React, { useEffect, useState } from 'react';

// export default function ViewIssuedSurrogate() {
//   const [issuedSamples, setIssuedSamples] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchIssuedSamples = async () => {
//       try {
//         const response = await fetch('http://localhost:4000/api/view-issued-surrogate');
//         if (!response.ok) {
//           throw new Error('Failed to fetch issued surrogate');
//         }
//         const data = await response.json();
//         setIssuedSamples(data.data || []);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchIssuedSamples();
//   }, []);

//   if (loading) {
//     return <p>Loading issued surrogates...</p>;
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
//             fontSize: '24px',
//             fontWeight: 'bold',
//           }}
//         >
//           Issued Surrogates
//         </h1>
//         <div style={{ padding: '20px' }}>
//           {issuedSamples.length > 0 ? (
//             <table
//               style={{
//                 width: '100%',
//                 borderCollapse: 'collapse',
//                 textAlign: 'left',
//               }}
//             >
//               <thead>
//                 <tr>
//                   <th style={{ borderBottom: '2px solid #ddd', padding: '10px' }}>Surrogate Name</th>
//                   <th style={{ borderBottom: '2px solid #ddd', padding: '10px' }}>aadhaarNumber</th>
//                   <th style={{ borderBottom: '2px solid #ddd', padding: '10px' }}>Blood Group</th>
//                   <th style={{ borderBottom: '2px solid #ddd', padding: '10px' }}>Height</th>
//                   <th style={{ borderBottom: '2px solid #ddd', padding: '10px' }}>Weight</th>
//                   <th style={{ borderBottom: '2px solid #ddd', padding: '10px' }}>Issued To Request</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {issuedSamples.map((sample, index) => (
//                   <tr key={index}>
//                     <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{sample.donorName}</td>
//                     <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{sample.aadharNumber}</td>
//                     <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{sample.bloodGroup}</td>
//                     <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{sample.height} cm</td>
//                     <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{sample.weight} kg</td>
//                     <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{sample.issuedToRequest}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p>No issued surrogates found.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";import { selectUser } from "../features/auth/authSlice";import AccessDenied from "./AccessDenied";

export const ViewIssuedSurrogate = () => {
  let user=useSelector(selectUser);  user=user.user;  const accessToThisPage=user.permissions.surrogateManagement.includes("view allocated surrogates"
);
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the issued surrogates
  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/view-issued-surrogate"
        ,{
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch surrogates");
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
    return <p>Loading surrogates...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
  accessToThisPage?
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
          Issued Surrogates
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
                      Surrogate Name
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
                          to={`/view-surrogate-details/${sample._id}`}
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
              No allocated surrogates found.
            </p>
          )}
        </div>
      </div>
    </div>:
    <AccessDenied/>
  );
};

export default ViewIssuedSurrogate;
