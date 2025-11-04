import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteARTBankAsync,
  fetchAllARTBanksAsync,
  selectARTBanks,
} from "../features/ARTbank/bankSlice";
import { ViewArtBank } from "./ViewArtBank";
import EditBank from "./EditBank";
import { selectUser } from "../features/auth/authSlice"; 
import AccessDenied from "./AccessDenied";

export const ViewArtBanks = () => {


  let user=useSelector(selectUser);
  user=user.user;

  const accessToThisPage = user.permissions.artBankManagement.includes("view art bank");
  const accessToEdit = user.permissions.artBankManagement.includes("edit art bank");
  const accessToDelete = user.permissions.artBankManagement.includes("delete art bank");

  const dispatch = useDispatch();
  const artBanks = useSelector(selectARTBanks);

  const [viewArtBank, setViewArtBank] = useState(false);
  const [showAcessDenied, setShowAccessDenied] = useState(false);
  const [editArtBank, setEditArtBank] = useState(false);
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const colors = {
    primary: "#ee3f65", // Purple
    accent: "#ee3f65", // Red
    background: "#f8fafc", // Soft background
    textPrimary: "#4a4a4a", // Dark Gray for readability
    textSecondary: "#6d6e70", // Muted Text
    borderColor: "#e0e0e0", // Border color for separation
  };

  const styles = {
    container: {
      padding: "50px",
      fontFamily: "'Inter', sans-serif",
      backgroundColor: colors.background,
      minHeight: "100vh",
    },
    successMessage: {
      backgroundColor: "#d1f7e5",
      color: "#047857",
      padding: "12px 16px",
      borderRadius: "6px",
      fontWeight: "600",
      marginBottom: "20px",
      textAlign: "center",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    title: {
      color: colors.primary,
      fontSize: "26px",
      fontWeight: "700",
      marginBottom: "20px",
      borderBottom: `3px solid ${colors.accent}`,
      paddingBottom: "10px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    tableContainer: {
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
      overflow: "hidden",
      padding: "20px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      backgroundColor: colors.primary,
      color: "white",
      fontSize: "15px",
      textAlign: "left",
    },
    tableHeaderCell: {
      padding: "14px 20px",
      fontWeight: "600",
      textTransform: "uppercase",
    },
    tableRow: {
      borderBottom: `1px solid ${colors.borderColor}`,
      transition: "background-color 0.3s ease",
    },
    tableRowHover: {
      backgroundColor: "#f3f3f7",
    },
    tableCell: {
      padding: "14px 20px",
      fontSize: "15px",
      color: colors.textPrimary,
    },
    actionContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "12px",
    },
    actionButton: {
      border: "none",
      cursor: "pointer",
      padding: "8px",
      borderRadius: "50%",
      fontSize: "18px",
      transition: "background-color 0.3s ease, transform 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "36px",
      height: "36px",
    },
    viewButton: {
      backgroundColor: "#eaf2ff",
      color: colors.primary,
    },
    editButton: {
      backgroundColor: "#ffedea",
      color: colors.accent,
    },
    deleteButton: {
      backgroundColor: "#ffeaea",
      color: "red",
    },
    emptyState: {
      textAlign: "center",
      padding: "40px",
      color: colors.textSecondary,
      fontSize: "18px",
      fontWeight: "500",
    },
  };

  const handleView = (bank) => {
    if(!accessToThisPage)
    {
      setShowAccessDenied(true);

    }
    else{
    setSelectedBankDetails(bank);
    setViewArtBank(true);
    }
  };

  const handleEdit = (bank) => {
    if(!accessToEdit){
      setShowAccessDenied(true);
    }
    else{
    setSelectedBankDetails(bank);
    setEditArtBank(true);
    }
  };

  const handleDelete = async (id) => {
    if(!accessToDelete){
      setShowAccessDenied(true);
    }
    else{
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this ART Bank?"
    );

    if (confirmDelete) {
      try {
        await dispatch(deleteARTBankAsync(id));
        setSuccessMessage("ART Bank successfully removed from the system");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        setSuccessMessage("Failed to delete ART Bank. Please try again.");
      }
    }
    }
  };

  const AccessDeniedModal = ({ onClose }) => {
    // Color scheme (matching your existing theme)
    const colors = {
      primary: "#ee3f65",
      secondary: "#a6a8ab",
      darkGray: "#444444",
      mediumGray: "#777777",
      lightGray: "#f7f7f7",
      border: "#e5e5e5",
      white: "#ffffff",
      accent: "#f9edef",
      focus: "#d8ebff",
      error: "#f44336"
    };
  
    return (
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{ 
          width: "400px",
          padding: "30px", 
          backgroundColor: colors.white,
          border: `1px solid ${colors.border}`, 
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          fontFamily: "Arial, sans-serif",
          color: colors.darkGray,
          textAlign: "center"
        }}>
          <div style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            backgroundColor: "#ffebee",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 20px auto"
          }}>
            <span style={{
              fontSize: "40px",
              color: colors.error,
              fontWeight: "bold"
            }}>!</span>
          </div>
  
          <h2 style={{ 
            color: colors.darkGray, 
            marginTop: 0,
            marginBottom: "16px",
            fontSize: "22px"
          }}>
            Access Denied
          </h2>
          
          <p style={{
            fontSize: "15px",
            color: colors.mediumGray,
            lineHeight: "1.5",
            marginBottom: "24px"
          }}>
            You don't have permission to perform this action. 
            Please contact your administrator for assistance.
          </p>
  
          <button 
            onClick={onClose}
            style={{
              padding: "10px 24px",
              backgroundColor: colors.primary,
              color: colors.white,
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              width: "140px"
            }}
          >
            Okay
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    dispatch(fetchAllARTBanksAsync());
  }, [dispatch]);

  if (showAcessDenied) {
    return (
      <AccessDeniedModal onClose={() => setShowAccessDenied(false)} />
    );}

  if (viewArtBank && accessToThisPage) {
    return (
      <ViewArtBank
        bankDetails={selectedBankDetails}
        setViewArtBank={setViewArtBank}
      />
    );
  }

  if (editArtBank && accessToEdit) {
    return (
      <EditBank
        bankDetails={selectedBankDetails}
        setEditArtBank={setEditArtBank}
      />
    );
  }

  return (
    <div style={styles.container}>
      {successMessage && <div style={styles.successMessage}>{successMessage}</div>}

      <h1 style={styles.title}>ART Banks Registry</h1>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.tableHeaderCell}>Sl No</th>
              <th style={styles.tableHeaderCell}>Bank Name</th>
              <th style={styles.tableHeaderCell} align="center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {artBanks.length === 0 ? (
              <tr>
                <td colSpan="3" style={styles.emptyState}>
                  No ART Banks registered yet
                </td>
              </tr>
            ) : (
              artBanks.map((bank, index) => (
                <tr
                  key={bank.registrationId}
                  style={{
                    ...styles.tableRow,
                    ...(index % 2 === 0 ? {} : styles.tableRowHover),
                  }}
                >
                  <td style={styles.tableCell}>{index + 1}</td>
                  <td style={styles.tableCell}>{bank.name}</td>
                  <td style={{ ...styles.tableCell, ...styles.actionContainer }}>
                    <button
                      onClick={() => handleView(bank)}
                      style={{ ...styles.actionButton, ...styles.viewButton }}
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => handleEdit(bank)}
                      style={{ ...styles.actionButton, ...styles.editButton }}
                      title="Edit Bank"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(bank.registrationId)}
                      style={{ ...styles.actionButton, ...styles.deleteButton }}
                      title="Delete Bank"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
