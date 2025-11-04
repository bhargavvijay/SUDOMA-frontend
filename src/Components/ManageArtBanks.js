import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteARTBankAsync,
  fetchAllARTBanksAsync,
  selectARTBanks,
} from "../features/ARTbank/bankSlice";
import { useEffect, useState } from "react";
import { ViewArtBank } from "./ViewArtBank";
import EditBank from "./EditBank";

export const ManageArtBanks = () => {
  const dispatch = useDispatch();
  const artBanks = useSelector(selectARTBanks);

  const [viewArtBank, setViewArtBank] = useState(false);
  const [editArtBank, setEditArtBank] = useState(false);
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleView = (bank) => {
    setSelectedBankDetails(bank);
    setViewArtBank(true);
  };

  const handleEdit = (bank) => {
    setSelectedBankDetails(bank);
    setEditArtBank(true);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this ART Bank?");
    if (isConfirmed) {
      dispatch(deleteARTBankAsync(id));
      setSuccessMessage("ART Bank deleted successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000); // Clear the message after 3 seconds
    }
  };
  

  useEffect(() => {
    dispatch(fetchAllARTBanksAsync());
  }, []);

  return (
    <>
      {!viewArtBank && !editArtBank ? (
        <div
          style={{
            padding: "20px",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#f4f4f4",
          }}
        >
          {successMessage && (
            <div
              style={{
                backgroundColor: "#d4edda",
                color: "#155724",
                padding: "15px",
                borderRadius: "5px",
                marginBottom: "20px",
                textAlign: "center",
                fontWeight: "bold",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {successMessage}
            </div>
          )}

          <h1
            style={{
              color: "#333",
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "10px",
              display: "block",
            }}
          >
            Manage ART Banks
          </h1>
          <Link to="/add-art-bank">
            <button
              style={{
                backgroundColor: "#ee3f65",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "normal",
                padding: "10px 20px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginBottom: "20px",
                display: "block",
              }}
            >
              Add ART Bank
            </button>
          </Link>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead style={{ backgroundColor: "#ee3f65", color: "#fff" }}>
              <tr>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    border: "1px solid #ddd",
                  }}
                >
                  Sl No
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    border: "1px solid #ddd",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {artBanks.map((bank, index) => (
                <tr
                  key={bank.registrationId}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                  }}
                >
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                    }}
                  >
                    {bank.name}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    <button
                      style={{
                        marginRight: "10px",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                      title="View"
                      onClick={() => handleView(bank)}
                    >
                      👁️
                    </button>
                    <button
                      style={{
                        marginRight: "10px",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                      title="Delete"
                      onClick={() => handleDelete(bank.registrationId)}
                    >
                      🗑️
                    </button>
                    <button
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                      title="Edit"
                      onClick={() => handleEdit(bank)}
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : viewArtBank ? (
        <ViewArtBank
          bankDetails={selectedBankDetails}
          setViewArtBank={setViewArtBank}
        />
      ) : (
        <EditBank
          bankDetails={selectedBankDetails}
          setEditArtBank={setEditArtBank}
        />
      )}
    </>
  );
};
